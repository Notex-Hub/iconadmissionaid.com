/* eslint-disable react/prop-types */

import ProgressCardCompact from "../../Dashboard/ExamRun/ProgressCardCompact";

const SAResultShow=({selectedOptions})=>{

   const totalQuestions = selectedOptions?.length;
    const correctAnswers = selectedOptions?.filter(
    q => q.selectedOption === q.answer
    ).length;
    const wrongAnswers = totalQuestions - correctAnswers;
    const marksObtained = selectedOptions
    .filter(q => q.selectedOption === q.answer)
    .reduce((sum, q) => sum + q.mark, 0);


    
    return(
        <ProgressCardCompact 
            subject={`English-SA`}
            percent = {wrongAnswers}
            correct = {marksObtained}
            viewDetails={false}
            total = {totalQuestions}
        />
    )
}
export default SAResultShow;