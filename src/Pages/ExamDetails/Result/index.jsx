/* eslint-disable react/prop-types */

import CQResultShow from "../../../Components/Exam/CQ/CQ";
import FillInTheGapsResultShow from "../../../Components/Exam/FillInTheGaps/FillInTheGaps";
import MCQResultShow from "../../../Components/Exam/MCQ/MCA";
import SAResultShow from "../../../Components/Exam/SA/SA";
import Navbar from "../../../Components/Home/Navbar/Navbar";
import Footer from "../../../Layout/Footer";
const ExamResultContainer = ({
  selectedMCQAnswers = [],
  selectedOptionsSA = [],
  fillInTheGapsUserAnswers = [],
  cQAnswers = [],
}) => {
  const hasData = (arr) => Array.isArray(arr) && arr.length > 0;

  return (
    <>
<Navbar/>
    <main className="container mx-auto px-4 pt-28 pb-12">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-3">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Exam Completed!</h2>
          <p className="text-gray-600 mt-1">
            Thank you for taking the examination.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {hasData(cQAnswers) && (
            <CQResultShow cQAnswers={cQAnswers} />
          )}

          {hasData(fillInTheGapsUserAnswers) && (
            <FillInTheGapsResultShow
              fillInTheGapsUserAnswers={fillInTheGapsUserAnswers}
            />
          )}

          {hasData(selectedOptionsSA) && (
            <SAResultShow selectedOptions={selectedOptionsSA} />
          )}

          {hasData(selectedMCQAnswers) && (
            <MCQResultShow selectedMCQAnswers={selectedMCQAnswers} />
          )}
        </div>

        <div className="mb-6 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-3 text-left">
          Detailed breakdown isn’t available because time expired and items weren’t saved.
          If you pass answers in navigate, details will appear here.
        </div>

      </div>
    </main>
    <Footer/>
        </>
  );
};

export default ExamResultContainer;

