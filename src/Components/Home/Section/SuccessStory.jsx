import  { useEffect, useRef, useState } from "react";
import SectionText from "../../Ui/SectionText";

const SuccessStory = () => {
  const universityClass = [
    {
      id: 1,
      title: "BRAC Spring 2026 Admission Help Desk",
      img: "/public/review/Rectangle 31.png",
    },
    {
      id: 2,
      title: "East West University Admission Help Desk",
      img: "/public/review/Rectangle 32.png",
    },
    {
      id: 3,
      title: "BRAC Spring 2026 Admission Help Desk",
      img: "/public/review/Rectangle 33.png",
    },
    {
      id: 4,
      title: "East West University Admission Help Desk",
      img: "/public/review/Rectangle 34.png",
    },
  ];

  const getSlidesPerView = () => {
    if (typeof window === "undefined") return 1;
    const w = window.innerWidth;
    if (w >= 1024) return 4;
    if (w >= 640) return 2;
    return 1;
  };

  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView);
  const [index, setIndex] = useState(0);
  const autoplayRef = useRef(null);
  const isHoverRef = useRef(false);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  useEffect(() => {
    const onResize = () => setSlidesPerView(getSlidesPerView());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const maxStartIndex = Math.max(0, universityClass.length - slidesPerView);
  useEffect(() => {
    if (index > maxStartIndex) setIndex(maxStartIndex);
  }, [slidesPerView, maxStartIndex]);

  // autoplay
  useEffect(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (isHoverRef.current) return;
      setIndex((prev) => (prev >= maxStartIndex ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(autoplayRef.current);
  }, [maxStartIndex]);

  const goPrev = () => setIndex((prev) => (prev === 0 ? maxStartIndex : prev - 1));
  const goNext = () => setIndex((prev) => (prev >= maxStartIndex ? 0 : prev + 1));

  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e) =>
    (touchDeltaX.current = e.touches[0].clientX - touchStartX.current);
  const handleTouchEnd = () => {
    const threshold = 50;
    if (touchDeltaX.current > threshold) goPrev();
    else if (touchDeltaX.current < -threshold) goNext();
    touchDeltaX.current = 0;
  };

  const slideWidthPercent = 100 / slidesPerView;
  const translatePercent = -(index * slideWidthPercent);

  const pageCount = Math.ceil(universityClass.length / slidesPerView);
  const activePage = Math.floor(index / slidesPerView);

  return (
    <div className="container mx-auto px-4">
      <div className="text-center my-12 md:my-16">
        <SectionText title="SUCCESS STORY" />
        <p className="mt-3 text-lg md:text-xl font-medium text-gray-700">
          আমাদের সাফল্যের হার ৯০%
        </p>
      </div>

      {/* Slider */}
      <div
        className="relative"
        onMouseEnter={() => (isHoverRef.current = true)}
        onMouseLeave={() => (isHoverRef.current = false)}
      >
        <div
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              width: `${(universityClass.length * 100) / slidesPerView}%`,
              transform: `translateX(${translatePercent}%)`,
            }}
          >
            {universityClass.map((item) => (
              <div
                key={item.id}
                className="px-2 flex-shrink-0"
                style={{ width: `${100 / slidesPerView}%` }}
              >
                <div className="rounded-xl overflow-hidden shadow-md  hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="md:w-full md:h-full  "
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/public/review/default.png";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prev & Next */}
        <button
          onClick={goPrev}
          className="absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 bg-white text-gray-800 rounded-full p-2 shadow hover:bg-red-500 hover:text-white transition"
          aria-label="Previous"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goNext}
          className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 bg-white text-gray-800 rounded-full p-2 shadow hover:bg-red-500 hover:text-white transition"
          aria-label="Next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center items-center gap-2 mt-5">
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i * slidesPerView)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activePage ? "w-8 bg-red-600" : "w-4 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SuccessStory;
