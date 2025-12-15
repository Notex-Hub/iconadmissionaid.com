/* eslint-disable react/prop-types */
import ProgressCardCompact from "../../Dashboard/ExamRun/ProgressCardCompact";

const MCQResultShow=({selectedMCQAnswers})=>{

  const groupedBySlug = selectedMCQAnswers?.reduce((acc, cur) => {
        if (!acc[cur.slug]) {
            acc[cur.slug] = {
                title: cur.title,
                slug: cur.slug,
                total: 0,
                correct: 0,
                wrong: 0,
            };
        }
        acc[cur.slug].total += 1;
        const selectedText = cur.options[cur.selectedIndex];
        if (selectedText === cur.correctAnswer) {
            acc[cur.slug].correct += 1;
        } else {
            acc[cur.slug].wrong += 1;
        }
        return acc;
    }, {});


    return(
        <>
            {Object.values(groupedBySlug || {}).map(
                        (item, index) => (
                            <ProgressCardCompact 
                            key={index}
                                    subject={`${item.title}-MCQ`}
                                    percent = {item.wrong}
                                    correct = {item.correct}
                                    viewDetails={false}
                                    total = {item.total}
                                />
                        )
            )} 
        </>
    )
}
export default MCQResultShow;