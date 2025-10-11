/* eslint-disable react/prop-types */


// eslint-disable-next-line no-undef
const Card = ({ course = sampleCourse }) => {
  return (
    <div className="bg-[#1e293b] rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
      <img className="w-full h-auto object-cover" src={course.imageUrl} alt={course.title} />
      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-2">{course.title}</h3>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-red-500 font-bold text-xl">{course.price}</p>
          <p className="text-gray-400 line-through">{course.originalPrice}</p>
        </div>
        <button className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300">
          কোর্সটি কিনুন
        </button>
      </div>
    </div>
  );
};

export default Card;