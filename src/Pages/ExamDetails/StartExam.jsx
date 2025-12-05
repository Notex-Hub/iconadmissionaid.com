import { useParams } from "react-router-dom";
import { useGetAllSubjectQuery } from "../../../redux/Features/Api/subject/subject";
import { useState } from "react";
import ExamSA from "../../Components/Exam/SA";
import ExamFillInTheGaps from "../../Components/Exam/FillInTheGaps";
import ExamMCQ from "../../Components/Exam/MCQ";
import ExamCQ from "../../Components/Exam/CQ";

const StartExam = () => {
  const { slug } = useParams();
  const { data: subjects } = useGetAllSubjectQuery();

  const [subjectIndex, setSubjectIndex] = useState(0);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false); // Result state

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

  // Check if this is last section of last subject
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
      // No more section or subject → Show result
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
              // Reset exam or redirect as needed
              setShowResult(false);
              setSubjectIndex(0);
              setSectionIndex(0);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Restart Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-bold mb-4">
          {currentSubject.title} – {currentSection} Exam
        </h2>

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

        <div className="mt-6 flex justify-between">
          <button
            disabled={subjectIndex === 0 && sectionIndex === 0}
            onClick={() => {
              if (sectionIndex > 0) setSectionIndex(sectionIndex - 1);
              else if (subjectIndex > 0) setSubjectIndex(subjectIndex - 1);
            }}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Previous
          </button>

          {isLastSection ? (
            <button
              onClick={() => setShowResult(true)}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Submit Result
            </button>
          ) : (
            <button
              onClick={goToNext}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartExam;
