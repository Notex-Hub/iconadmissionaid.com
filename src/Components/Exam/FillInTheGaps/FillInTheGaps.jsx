/* eslint-disable react/prop-types */
import ProgressCardCompact from "../../Dashboard/ExamRun/ProgressCardCompact";

const FillInTheGapsResultShow = ({ fillInTheGapsUserAnswers }) => {
  const totalQuestions = fillInTheGapsUserAnswers?.length || 0;
  const correctAnswers = fillInTheGapsUserAnswers?.filter(
    (q) => q.isCorrect
  )?.length || 0;

  const wrongAnswers = totalQuestions - correctAnswers;

  const marksObtained = fillInTheGapsUserAnswers
    ?.filter((q) => q.isCorrect)
    .reduce((sum, q) => sum + (q.mark || 0), 0) || 0;

  return (
       <ProgressCardCompact 
            subject={`English-FillInTheGaps`}
            percent = {wrongAnswers}
            correct = {marksObtained}
            viewDetails={false}
            total = {totalQuestions}
        />
  );
};

export default FillInTheGapsResultShow;
