/* eslint-disable react/prop-types */
const SectionText = ({ title }) => {
  return (
    <h1
      className="md:text-7xl text-3xl font-bold 
      bg-gradient-to-r from-[#6A0000] via-[#B10000] to-[#FF0000] 
      bg-clip-text text-transparent"
    >
      {title}
    </h1>
  );
};

export default SectionText;
