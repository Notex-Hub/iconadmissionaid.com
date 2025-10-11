import CourseCard from "../Ui/CourseCard";

const CoursesSection = () => {
  const courses = [
    {
      id: 1,
      title: "",
      price: "৳ ২৫০০",
      originalPrice: "৳ ৩৫০০",
      imageUrl: "https://via.placeholder.com/400x225",
    },
    {
      id: 2,
      title: "HSC 24 শেষ মুহূর্তের প্রস্তুতি",
      price: "৳ ২০০০",
      originalPrice: "৳ ৩০০০",
      imageUrl: "https://via.placeholder.com/400x225",
    },
    {
      id: 3,
      title: "SSC 25 অনলাইন ব্যাচ",
      price: "৳ ১৮০০",
      originalPrice: "৳ ২৮০০",
      imageUrl: "https://via.placeholder.com/400x225",
    },
    {
      id: 4,
      title: "SSC 24 টেস্ট পেপার সলভ",
      price: "৳ ১৫০০",
      originalPrice: "৳ ২৫০০",
      imageUrl: "https://via.placeholder.com/400x225",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CoursesSection;
