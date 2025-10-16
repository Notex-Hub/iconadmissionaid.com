import { useMemo, useState } from "react";
import Navbar from "../../Components/Home/Navbar/Navbar";
import UniversitySmallCard from "../../Components/Package/UniversitySmallCard";
import BannerSection from "../../Components/Ui/BannerSection";
import SectionText from "../../Components/Ui/SectionText";
import Footer from "../../Layout/Footer";
import banner from "../../assets/banner/freetestBanner.png";
import Button from "../../Components/Ui/Button";
import { useGetAllExamQuery } from "../../../redux/Features/Api/Exam/Exam";
import { useGetAllModuleQuery } from "../../../redux/Features/Api/Module/ModuleApi";
import { useGetUniversityQuery } from "../../../redux/Features/Api/university/university";
import ExamGrid from "../../Components/Exam/ExamGrid";

const FreeTest = () => {
  const { data: universityData } = useGetUniversityQuery();
  // eslint-disable-next-line no-unused-vars
  const { data: moduleData } = useGetAllModuleQuery();
  const { data: examData, isLoading, isError } = useGetAllExamQuery({ isFree: true });

  const exams = examData?.data ?? [];
  const universitiesFromApi = universityData?.data ?? [];

  const universities = useMemo(
    () =>
      universitiesFromApi.map((u) => ({
        id: u._id,
        title: u.name,
        img: u.cover_photo ?? "/public/university/default.png",
        slug: u.slug ?? null,
      })),
    [universitiesFromApi]
  );

  const [selectedUniId, setSelectedUniId] = useState(null);

  const filteredExams = useMemo(() => {
    if (!selectedUniId) return exams;
    return exams.filter((e) => {
      if (!e?.universityId) return false;
      if (typeof e.universityId === "string") return e.universityId === selectedUniId;
      return e.universityId._id === selectedUniId;
    });
  }, [exams, selectedUniId]);

  const handleResetFilter = () => setSelectedUniId(null);

  return (
    <div className="relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <BannerSection
        banner={banner}
        text={{
          title: "University-Standard Online Exams Smart & Secure",
          subtitle:
            "Prepare students with real NSU, BRACU, AUST, EWU, AIUB & IUB exam patterns.",
        }}
      />

      <div className="container mx-auto px-4">
        <div className="text-center my-12 md:my-16">
          <SectionText title="বিশ্ববিদ্যালয় ভিত্তিক মডেল টেস্ট" />
          <p className="mt-3 text-lg md:text-xl font-medium text-gray-700 max-w-2xl mx-auto">
            বাস্তব পরীক্ষার মতো অভিজ্ঞতা পেতে বিশ্ববিদ্যালয়-স্টাইল মডেল টেস্ট।
          </p>
        </div>

        <div className="mb-4">
          <UniversitySmallCard
            universities={universities}
            selectedId={selectedUniId}
            onSelect={(id) => setSelectedUniId(id)}
          />
        </div>

        {isError ? (
          <div className="text-center py-8 text-red-500">এক্সাম লোড করতে সমস্যা হয়েছে।</div>
        ) : (
          <>
            {/* Loading or Grid */}
            <ExamGrid exams={filteredExams} loading={isLoading} />

            {/* Empty state when not loading and no exams */}
            {!isLoading && filteredExams.length === 0 && (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-36 h-36 flex items-center justify-center rounded-full bg-gray-100 mb-6 shadow-sm">
                  {/* Simple exam/book SVG icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7" />
                  </svg>
                </div>

                <h3 className="text-2xl font-semibold text-gray-800 mb-2">কোনও ফ্রি টেস্ট পাওয়া যায়নি</h3>
                <p className="text-gray-600 max-w-xl px-4">
                  বর্তমানে তোমার নির্বাচিত বিশ্ববিদ্যালয়ের জন্য কোনো ফ্রি পরীক্ষা উপলব্ধ নেই।
                  তুমি অন্য বিশ্ববিদ্যালয় বেছে নিতে পারো অথবা ফিল্টার ক্লিয়ার করে সব ফ্রি টেস্ট দেখতে পারো।
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleResetFilter}
                    className="px-4 py-2 rounded-lg bg-[#5D0000] text-white font-medium hover:bg-red-700 transition"
                  >
                    সব ফ্রি টেস্ট দেখো
                  </button>

                  <a
                    href="/contact"
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  >
                    আমাদের জানান
                  </a>
                </div>
              </div>
            )}
          </>
        )}

        {exams.length === 8 && (
          <div className="flex justify-center my-6">
            <Button text="View All Exams" />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FreeTest;
