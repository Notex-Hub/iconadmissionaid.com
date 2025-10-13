import { useState } from "react";
import logo from "../../../assets/Home/logo.png";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-4 md:py-3 mt-5 transition-all duration-300 ${
        mobileMenuOpen
          ? "bg-white/5 backdrop-blur-lg   shadow-lg"
          : "bg-white/5 backdrop-blur-md  shadow-md"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between gap-4 ">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src={logo}
            alt="logo"
            className="w-20 h-10 md:w-full md:h-full"
          />{" "}
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md mx-4"
        >
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full px-4 py-2 pr-10 rounded-full 
                 bg-white/20 backdrop-blur-md  border-none
                 text-white placeholder-white/70 
                 focus:outline-none focus:ring-2 focus:ring-white/40 
                 transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 
                 text-white/80 hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {[
            { name: "Home", path: "/" },
            { name: "Courses", path: "/courses" },
            { name: "Books", path: "/books" },
            { name: "FREE CLASS", path: "/free-class" },
            { name: "FREE TEST", path: "/free-test" },
          ].map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              className="text-white hover:text-gray-800 transition-colors  drop-shadow"
            >
              {name}
            </Link>
          ))}
        </div>
        {/* Login Button */}
        <button className="hidden cursor-pointer md:flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all backdrop-blur-sm shadow">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="">Login</span>
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-white p-2"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 space-y-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 shadow-lg">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="md:hidden">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full px-4 py-2 pr-10 rounded-full border-none bg-white/70 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-2">
            {[
              { name: "Home", path: "/" },
              { name: "Courses", path: "/courses" },
              { name: "Books", path: "/books" },
              { name: "FREE CLASS", path: "/free-class" },
              { name: "FREE TEST", path: "/free-test" },
            ].map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                className="text-white hover:bg-black/10 px-4 py-2 rounded transition-colors"
              >
                {name}
              </Link>
            ))}

            <button className="md:hidden flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all mt-2 border border-white/30 shadow">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Login</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
