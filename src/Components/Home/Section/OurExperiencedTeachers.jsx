import { useGetTeacherQuery } from "../../../../redux/Features/Api/teachers/teachersApi";
import SectionText from "../../Ui/SectionText";

const OurExperiencedTeachers = () => {
  const { data: teacherData, isLoading, isError } = useGetTeacherQuery();

  const teachers = teacherData?.data ?? [];

  const getTeacherImage = (t) =>
    t?.profile_picture ||
    t?.userId?.profile_picture ||
    "/public/university/default-teacher.png";

  const showTeachers = teachers; // চাইলে slice(0,4) দিতে পারেন

  return (
    <div className="container mx-auto px-4">
      <div className="text-center my-12 md:my-16">
        <SectionText title="আমাদের অভিজ্ঞ শিক্ষক" />
        <p className="mt-3 text-lg md:text-xl font-medium text-gray-700">
          সফলতা অনুপ্রাণিতকারী অভিজ্ঞ মেন্টরদের সঙ্গে আপনার ভবিষ্যত গড়ুন।
        </p>
      </div>

      {isLoading && (
        <div className="text-center py-8 text-gray-600">লোড হচ্ছে...</div>
      )}

      {isError && (
        <div className="text-center py-8 text-red-500">
          শিক্ষক তথ্য লোড করতে সমস্যা হয়েছে।
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {showTeachers.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              কোনো শিক্ষক পাওয়া যায়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {showTeachers.map((t, index) => (
                <div
                  key={t._id ?? index}
                  className="relative group overflow-hidden rounded-lg shadow-md"
                >
                  {/* Teacher Image */}
                  <img
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    src={getTeacherImage(t)}
                    alt={t?.name ?? "Teacher"}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "/public/university/default-teacher.png";
                    }}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white px-4 text-center">
                    <h3 className="text-lg font-semibold mb-1">
                      {t?.name ?? "Unknown"}
                    </h3>
                    {/* <p className="text-sm">{t?.phone ?? "No phone"}</p> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OurExperiencedTeachers;
