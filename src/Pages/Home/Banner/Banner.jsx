import { CiSearch } from "react-icons/ci";

const Banner = () => {
    return (
      <section className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 md:h-[600px] flex flex-col justify-center items-center text-white">
        <div className="text-center py-32">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            AI-Powered Job Matching for the Future
          </h1>
          <p className="text-lg md:text-xl mb-6 text-center max-w-2xl mx-auto">
            Revolutionizing recruitment with advanced AI and skill matching technology. Find your perfect career match today.
          </p>
          <div className="flex justify-center space-x-4 md:flex-row flex-col gap-2 px-2">
            <input
              type="text"
              placeholder="Type here"
              className="input   w-full max-w-xs placeholder:text-black   text-black"
            />
            <button className="bg-white px-2 py-2 rounded-md text-black cursor-pointer flex items-center gap-2"> <CiSearch className="text-xl"/>Search</button>
          </div>
        </div>
      </section>
    );
  };
  
  export default Banner;
  