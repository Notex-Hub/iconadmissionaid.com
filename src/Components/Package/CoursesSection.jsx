import { useGetAllCourseQuery } from "../../../redux/Features/Api/Course/CourseApi";
import Button from "../Ui/Button";
import CourseCard from "../Ui/CourseCard";

const CoursesSection = () => {
  const { data: courseData, isLoading, isError } = useGetAllCourseQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;

  const courses = courseData?.data || [];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      {courses.length === 8 && (
        <div className="flex justify-center items-center my-5">
          <Button text="View All Courses" />
        </div>
      )}
    </div>
  );
};

export default CoursesSection;
