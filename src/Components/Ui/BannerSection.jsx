/* eslint-disable react/prop-types */
const BannerSection = ({ banner, text }) => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Banner image */}
      <div className="relative w-full">
        <img
          src={banner}
          alt="Banner"
          className="object-cover object-center h-[500px] w-full"
        />
      </div>

      {/* Overlay only if text exists */}
      {text && (
        <>
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Centered text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg leading-snug">
              {text.title || ""}
            </h1>
            {text.subtitle && (
              <p className="mt-4 text-base md:text-xl text-gray-200 max-w-2xl">
                {text.subtitle}
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default BannerSection;
