/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import bookFallback from "../../assets/book/ewb.png";

const BookCard = ({ course }) => {
  const title = course?.title || "Untitled Book";
  const cover = course?.coverPhoto || bookFallback;
  const price = typeof course?.price === "number" ? course.price : 0;
  const offer = typeof course?.offerPrice === "number" ? course.offerPrice : 0;
  const showOriginal = offer > 0 && offer < price;
  const displayOffer = offer > 0 ? offer : price;

  return (
    <div className="rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 p-3">
      {/* Maintain 1:1 aspect ratio */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={cover}
          alt={title}
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <h3 className="font-bold md:text-lg text-xs text-center text-[#F91616] mb-2 md:px-5">
          {title}
        </h3>

        <div className="flex justify-center items-center gap-2 mb-4">
          {showOriginal && (
            <p className="text-[#D91A19] line-through">TK {price}</p>
          )}
          <p className="text-[#008000]">
            {displayOffer === 0 ? "Free" : `TK ${displayOffer}`}
          </p>
        </div>

        <div className="flex justify-between items-center md:gap-4">
          <Link to={`/book/${course?.slug}`}>
            <button className="md:w-full text-xs cursor-pointer mr-2 bg-gradient-to-r from-[#1E5A1E] to-[#008000] text-white font-semibold py-2 px-2 rounded-lg transition-colors duration-300">
              এক নজরে পড়ুন
            </button>
          </Link>
          <Link
            to={`/buy/book/${course?.slug}`}
            className="bg-[#F91616] text-xs cursor-pointer text-white font-semibold py-2 px-2 rounded-lg transition-colors duration-300"
          >
            অর্ডার করুন
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
