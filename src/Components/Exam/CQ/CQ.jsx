/* eslint-disable react/prop-types */
import ProgressCardCompact from "../../Dashboard/ExamRun/ProgressCardCompact";

const CQResultShow = ({ cQAnswers }) => {
  const marksObtained = cQAnswers?.reduce(
    (acc, item) => acc + (item.obtainedMark || 0),
    0
  );

  const totalMarks = cQAnswers?.reduce((acc, item) => acc + (item.maxMark || 0), 0);

  const wrongMarks = totalMarks - marksObtained;
console.log("totalMarks",totalMarks)
console.log("totalMarks",marksObtained)
  const percent = totalMarks > 0 ? Math.round((marksObtained / totalMarks) * 100) : 0;

  return (
    <ProgressCardCompact
      subject="English - CQ"
      percent={percent}         
      correct={marksObtained}    
      wrong={wrongMarks}        
      viewDetails={false}
      total={totalMarks}         
    />
  );
};

export default CQResultShow;
