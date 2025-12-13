import { useParams } from "react-router-dom";
import { useGetAllSubjectQuery } from "../../../redux/Features/Api/subject/subject";
import { useState } from "react";
import ExamSA from "../../Components/Exam/SA";
import ExamFillInTheGaps from "../../Components/Exam/FillInTheGaps";
import ExamMCQ from "../../Components/Exam/MCQ";
import ExamCQ from "../../Components/Exam/CQ";
import Footer from "../../Layout/Footer";
import Navbar from "../../Components/Home/Navbar/Navbar";

const StartExam = () => {
  const { slug } = useParams();
  const { data: subjects } = useGetAllSubjectQuery();

  const [subjectIndex, setSubjectIndex] = useState(0);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const filteredSubjects = subjects?.data.filter(
    (subj) => subj?.modelTest?.slug === slug
  );

  const currentSubject = filteredSubjects?.[subjectIndex];
  if (!currentSubject) return null;

  const englishSections = ["MCQ", "FillInTheGaps", "CQ", "SA"];
  const defaultSections = ["MCQ"];

  const sectionsToShow =
    currentSubject.title === "English" ? englishSections : defaultSections;

  const currentSection = sectionsToShow[sectionIndex];

  const isLastSection =
    subjectIndex === filteredSubjects.length - 1 &&
    sectionIndex === sectionsToShow.length - 1;

  const goToNext = () => {
    if (sectionIndex < sectionsToShow.length - 1) {
      setSectionIndex(sectionIndex + 1);
    } else if (subjectIndex < filteredSubjects.length - 1) {
      setSubjectIndex(subjectIndex + 1);
      setSectionIndex(0);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="min-h-screen flex justify-center items-center p-6 bg-gray-100">
        <div className="bg-white p-8 rounded shadow max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Exam Completed!</h2>
          <p className="mb-6">Your result is ready to view.</p>

          <button
            onClick={() => {
              setShowResult(false);
              setSubjectIndex(0);
              setSectionIndex(0);
            }}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Restart Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {/* Fixed Exam Header */}
      <div className="fixed top-0 left-0 right-0 bg-red-700 text-white py-4 shadow z-10">
        <div className="max-w-5xl mx-auto px-4 flex justify-between">
          <h2 className="text-lg font-semibold">
            {currentSubject.title} Exam
          </h2>
          <p className="opacity-90">Section: {currentSection}</p>
        </div>
      </div>

      <div className="min-h-screen p-6 flex justify-center pt-28 bg-gray-50">
        <div className="w-full max-w-3xl bg-white shadow-md rounded-xl p-6">

          {/* Section Title */}
          <div className="mb-6 pb-4 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              {currentSubject.title} – {currentSection}
            </h2>

            {/* Section Steps */}
            <div className="flex gap-2 mt-3">
              {sectionsToShow.map((sec, idx) => (
                <span
                  key={sec}
                  className={`px-3 py-1 rounded-full text-sm ${
                    idx === sectionIndex
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {sec}
                </span>
              ))}
            </div>
          </div>

          {/* Render Current Section Component */}
          {sectionsToShow.map((sec, index) =>
            index === sectionIndex ? (
              <div key={sec}>
                {sec === "MCQ" && <ExamMCQ subject={currentSubject} onNext={goToNext} />}
                {sec === "FillInTheGaps" && (
                  <ExamFillInTheGaps subject={currentSubject} onNext={goToNext} />
                )}
                {sec === "CQ" && <ExamCQ subject={currentSubject} onNext={goToNext} />}
                {sec === "SA" && <ExamSA subject={currentSubject} onNext={goToNext} />}
              </div>
            ) : null
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between">

            {/* Previous Btn */}
            <button
              disabled={subjectIndex === 0 && sectionIndex === 0}
              onClick={() => {
                if (sectionIndex > 0) setSectionIndex(sectionIndex - 1);
                else if (subjectIndex > 0) setSubjectIndex(subjectIndex - 1);
              }}
              className="px-5 py-3 bg-gray-200 rounded-lg font-semibold transition 
                        hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Next / Submit Btn */}
            {isLastSection ? (
              <button
                onClick={() => setShowResult(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow 
                           hover:bg-green-700 transition"
              >
                Submit Result
              </button>
            ) : (
              <button
                onClick={goToNext}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold shadow 
                           hover:bg-red-700 transition"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default StartExam;
