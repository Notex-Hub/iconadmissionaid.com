/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

export default function ErrorPage({
  code = 404,
  title = "Page Not Found",
  message = "The page you are looking for doesn't exist or has been moved.",
}) {
  const navigate = useNavigate();

  const isServerError = code >= 500;
  const primary = isServerError ? "#B91C1C" : "#5D0000"; // red tone for 500, maroon for 404

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 text-center px-4">
      {/* Illustration */}
      <div className="relative">
        <div className="absolute -top-6 -left-8 w-28 h-28 bg-red-100 rounded-full blur-2xl opacity-60"></div>
        <div className="absolute -bottom-6 -right-8 w-32 h-32 bg-amber-100 rounded-full blur-2xl opacity-60"></div>
        <img
          src="https://illustrations.popsy.co/gray/error-404.svg"
          alt="Error illustration"
          className="w-60 sm:w-80 relative z-10 select-none pointer-events-none"
        />
      </div>

      {/* Code */}
      <h1
        className="mt-6 text-7xl sm:text-8xl font-extrabold tracking-tight"
        style={{ color: primary }}
      >
        {code}
      </h1>

      {/* Title */}
      <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-800">
        {title}
      </h2>

      {/* Message */}
      <p className="mt-3 max-w-md text-gray-600 leading-relaxed">
        {message}
      </p>

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-lg cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 cursor-pointer rounded-lg text-white font-semibold shadow-md transition"
          style={{ background: primary }}
        >
          Back to Home
        </button>
      </div>

      {/* Footer */}
      <p className="mt-10 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Icon Admission Aid. All rights reserved.
      </p>
    </div>
  );
}
