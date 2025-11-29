"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Home/Navbar/Navbar";
import BannerSection from "../../Components/Ui/BannerSection";
import SectionText from "../../Components/Ui/SectionText";
import Footer from "../../Layout/Footer";
import banner from "../../assets/banner/freetestBanner.png";
import Button from "../../Components/Ui/Button";

const FreeTest = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(
          "https://sandbox.iconadmissionaid.com/api/v1/model-test"
        );
        const data = await res.json();
        if (data.status) {
          setExams(data.data);
        } else {
          setExams([]);
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  // Get unique universities from exams
  const universities = Array.from(
    new Set(exams.map((exam) => exam.university))
  );

  // Filter exams by selected university
  const filteredExams = selectedUniversity
    ? exams.filter((exam) => exam.university === selectedUniversity)
    : exams;

  const handleResetFilter = () => setSelectedUniversity("");

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
          <SectionText title="মডেল টেস্ট" />
          <p className="mt-3 text-lg md:text-xl font-medium text-gray-700 max-w-2xl mx-auto">
            বিশ্ববিদ্যালয়ের স্টাইল অনুযায়ী মডেল টেস্ট সমূহ।
          </p>
        </div>

        {/* University filter */}
        <div className="flex gap-3 flex-wrap justify-center mb-6">
          {universities.map((uni, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 rounded-full border ${
                selectedUniversity === uni
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-300"
              } hover:bg-indigo-500 hover:text-white transition`}
              onClick={() => setSelectedUniversity(uni)}
            >
              {uni}
            </button>
          ))}
          {selectedUniversity && (
            <button
              onClick={handleResetFilter}
              className="px-4 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
            >
              Reset
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-8 text-red-500">
            এক্সাম লোড করতে সমস্যা হয়েছে।
          </div>
        )}

        {/* Exams List */}
        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {loading ? (
              <div className="col-span-full text-center py-20 text-gray-500">
                Loading...
              </div>
            ) : filteredExams.length === 0 ? (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                <div className="w-36 h-36 flex items-center justify-center rounded-full bg-gray-100 mb-6 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 7v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  কোনও টেস্ট পাওয়া যায়নি
                </h3>
                <p className="text-gray-600 max-w-xl px-4">
                  বর্তমানে নির্বাচিত বিশ্ববিদ্যালয়ের জন্য কোনো মডেল টেস্ট নেই।
                </p>
              </div>
            ) : (
              filteredExams.map((exam) => (
                <Link
                  to={`/exam/exam-details/${exam.slug}`}
                  key={exam._id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:scale-105 transform transition"
                >
                  {/* Exam Image */}
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={exam.image ?? "/public/university/default.png"}
                      alt={exam.title}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src = "/public/university/default.png")
                      }
                    />
                  </div>

                  {/* Exam Info */}
                  <div className="p-4 text-center">
                    <h3 className="text-xl font-bold text-[#8B0000]">{exam.title}</h3>
                    <p className="text-gray-600 mb-2">{exam.university}</p>

                    {/* Departments */}
                    <div className="flex gap-2 overflow-x-auto justify-center py-1 mb-2">
                      {exam.departments?.map((dep, idx) => (
                        <span
                          key={idx}
                          className="flex-shrink-0 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                        >
                          {dep}
                        </span>
                      ))}
                    </div>

                    {/* Sections */}
                    <div className="flex gap-2 overflow-x-auto justify-center py-1">
                      {exam.sectionsOrderForEnglish?.map((sec, idx) => (
                        <span
                          key={idx}
                          className="flex-shrink-0 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* View All Exams Button */}
        {exams.length >= 8 && (
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
