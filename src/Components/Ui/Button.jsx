/* eslint-disable react/prop-types */
const Button = ({ text, className = "" }) => {
  // Default design
  const defaultDesign = "text-white bg-black px-3 py-2 rounded";

  return <button className={`${defaultDesign} ${className}`}>{text}</button>;
};

export default Button;
