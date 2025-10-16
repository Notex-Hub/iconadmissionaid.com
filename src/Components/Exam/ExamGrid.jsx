/* eslint-disable react/prop-types */
import ExamCard from "./ExamCard";
import ExamSkeleton from "./ExamSkeleton";

const ExamGrid = ({ exams, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-5">
        {Array.from({ length: 8 }).map((_, idx) => (
          <ExamSkeleton key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-5">
      {exams.map((exam) => (
        <div key={exam._id} className="min-w-0">
          <ExamCard exam={exam} />
        </div>
      ))}
    </div>
  );
};

export default ExamGrid;
