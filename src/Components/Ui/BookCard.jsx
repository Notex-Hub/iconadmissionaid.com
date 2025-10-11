/* eslint-disable react/prop-types */

const BookCard = ({ course }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 p-3">
      <img
        className="w-full h-auto object-cover"
        src={"/public/course/img.jpg"}
        alt={course.title}
      />
      <div className="p-4">
        <h3 className="font-bold text-lg text-center text-[#F91616] mb-2 px-5">
          BRAC University Model Question Book
        </h3>
        <div className="flex justify-center items-center  gap-2 mb-4">
          <p className="text-[#D91A19] line-through">TK 650</p>
          <p className="text-[#008000] ">TK 500</p>
        </div>
        <div className="flex justify-between items-center gap-4">
          <button className="w-full bg-gradient-to-r  from-[#1E5A1E]  to-[#008000] text-white font-semibold py-2 px-2 rounded-lg  transition-colors duration-300">
            এক নজরে পড়ুন
          </button>
          <button className="w-full bg-[#F91616] text-white font-semibold py-2 px-2 rounded-lg  transition-colors duration-300">
           অর্ডার করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
