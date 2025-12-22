import { useParams } from "react-router-dom";
import { useGetAllSubjectQuery } from "../../../redux/Features/Api/subject/subject";
import { useState } from "react";
import ExamSA from "../../Components/Exam/SA";
import ExamFillInTheGaps from "../../Components/Exam/FillInTheGaps";
import ExamMCQ from "../../Components/Exam/MCQ";
import ExamCQ from "../../Components/Exam/CQ";
import Footer from "../../Layout/Footer";
import Navbar from "../../Components/Home/Navbar/Navbar";
import ExamResultContainer from "./Result";

const StartExam = () => {
  const { slug } = useParams();
  const { data: subjects } = useGetAllSubjectQuery();

  const [selectedMCQAnswers, setSelectedMCQAnswers] = useState([]);
  const [selectedOptionsSA, setSelectedOptionsSA] = useState([]);
  const [userAnswersCQ, setUserAnswersCQ] = useState([]);
  const [fillInTheGapsUserAnswers, setFillInTheGapsUserAnswers] = useState([]);
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const filteredSubjects = subjects?.data.filter(
    (subj) => subj?.modelTest?.slug === slug
  );

  const currentSubject = filteredSubjects?.[subjectIndex];

  // সাবজেক্ট না পাওয়া গেলে লোডিং বা এরর
  if (!currentSubject) return <div className="h-screen flex items-center justify-center font-bold text-gray-400">Loading Exam Data...</div>;

  const englishSections = ["MCQ", "FillInTheGaps", "CQ", "SA"];
  const defaultSections = ["MCQ"];
  const sectionsToShow = currentSubject.title.toLowerCase() === "English".toLowerCase() ? englishSections : defaultSections;
  const currentSection = sectionsToShow[sectionIndex];

  // প্রগ্রেস লজিক: প্রথম সেকশনে ০% দেখাবে
  const totalSteps = filteredSubjects.length * sectionsToShow.length;
  const currentStep = (subjectIndex * sectionsToShow.length) + sectionIndex;
  const progressPercentage = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  const isLastSection =
    subjectIndex === filteredSubjects.length - 1 &&
    sectionIndex === sectionsToShow.length - 1;

  const goToNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (sectionIndex < sectionsToShow.length - 1) {
      setSectionIndex(sectionIndex + 1);
    } else if (subjectIndex < filteredSubjects.length - 1) {
      setSubjectIndex(subjectIndex + 1);
      setSectionIndex(0);
    } else {
      setShowResult(true);
    }
  };

  const goToPrevious = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (sectionIndex > 0) {
      setSectionIndex(sectionIndex - 1);
    } else if (subjectIndex > 0) {
      setSubjectIndex(subjectIndex - 1);
      setSectionIndex(sectionsToShow.length - 1);
    }
  };

  if (showResult) {
    return (
      <ExamResultContainer
        selectedMCQAnswers={selectedMCQAnswers}
        selectedOptionsSA={selectedOptionsSA}
        fillInTheGapsUserAnswers={fillInTheGapsUserAnswers}
        cQAnswers={userAnswersCQ}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Modern Sticky Header with Progress */}
      <div className="fixed top-[64px] left-0 right-0 bg-white border-b shadow-sm z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B0000] bg-red-50 px-2 py-0.5 rounded">Current Subject</span>
              <h2 className="text-2xl font-black text-gray-800 uppercase mt-1">
                {currentSubject.title}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-gray-400 uppercase">Progress</span>
              <p className="text-xl font-black text-[#8B0000]">{Math.round(progressPercentage)}%</p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-50">
            <div 
              className="bg-gradient-to-r from-red-500 to-[#8B0000] h-full transition-all duration-1000 ease-in-out" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-48 pb-20">
        {/* Section Pills Indicator */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {sectionsToShow.map((sec, idx) => (
            <div
              key={sec}
              className={`px-5 py-2 rounded-full text-[11px] font-black tracking-widest uppercase transition-all border ${
                idx === sectionIndex
                  ? "bg-[#8B0000] border-[#8B0000] text-white shadow-lg"
                  : idx < sectionIndex 
                    ? "bg-green-100 border-green-200 text-green-700"
                    : "bg-white border-gray-200 text-gray-400"
              }`}
            >
              {idx < sectionIndex ? "✓ " : ""}{sec}
            </div>
          ))}
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-6 md:p-10">
          <div className="min-h-[300px]">
            {currentSection === "MCQ" && (
              <ExamMCQ
                subject={currentSubject}
                selectedMCQAnswers={selectedMCQAnswers}
                setSelectedMCQAnswers={setSelectedMCQAnswers}
              />
            )}
            {currentSection === "FillInTheGaps" && (
              <ExamFillInTheGaps
                subject={currentSubject}
                onNext={goToNext}
                userAnswers={fillInTheGapsUserAnswers}
                setUserAnswers={setFillInTheGapsUserAnswers}
              />
            )}
            {currentSection === "CQ" && (
              <ExamCQ
                subject={currentSubject}
                onNext={goToNext}
                userAnswers={userAnswersCQ}
                setUserAnswers={setUserAnswersCQ}
              />
            )}
            {currentSection === "SA" && (
              <ExamSA
                subject={currentSubject}
                onNext={goToNext}
                selectedOptions={selectedOptionsSA}
                setSelectedOptions={setSelectedOptionsSA}
              />
            )}
          </div>

          {/* Navigation Controls */}
          <div className="mt-16 flex items-center justify-between border-t border-gray-50 pt-10">
            <button
              disabled={subjectIndex === 0 && sectionIndex === 0}
              onClick={goToPrevious}
              className="px-8 py-3 rounded-xl font-bold text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-20 transition-all uppercase text-xs tracking-widest"
            >
              ← Previous
            </button>

            {isLastSection ? (
              <button
                onClick={() => setShowResult(true)}
                className="px-10 py-4 bg-green-600 text-white rounded-xl font-black shadow-xl shadow-green-100 hover:bg-green-700 hover:-translate-y-1 transition-all uppercase text-sm"
              >
                Finish & Submit
              </button>
            ) : (
              <button
                onClick={goToNext}
                className="px-10 py-4 bg-[#8B0000] text-white rounded-xl font-black shadow-xl shadow-red-100 hover:bg-red-900 hover:-translate-y-1 transition-all uppercase text-sm tracking-wider"
              >
                Next Section →
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StartExam;