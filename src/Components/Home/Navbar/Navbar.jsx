import { useEffect, useState } from "react";
import logo from "../../../assets/Home/logo.png";
import { Link } from "react-router-dom";
import SignUpModal from "../../Auth/SignUpModal/SignUpModal";
import LoginModal from "../../Auth/LoginModal/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedOut } from "../../../../redux/Features/Api/Auth/AuthSlice";

export default function Navbar() {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  const handleSearch = (e) => e.preventDefault();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor =
    isScrolled || mobileMenuOpen ? "text-gray-800" : "text-white";
  const bgColor =
    isScrolled || mobileMenuOpen
      ? "bg-white shadow-md"
      : "bg-white/10 backdrop-blur-md shadow-sm";

  const logouthandel = async () => {
    dispatch(userLoggedOut());
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 px-4 md:py-3 mt-5 transition-all duration-300 ${bgColor}`}
      >
        <div className="container mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src={logo} alt="logo" className="w-20 h-10 md:w-24 md:h-12" />
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
                className={`w-full px-4 py-2 pr-10 rounded-full border ${
                  isScrolled || mobileMenuOpen
                    ? "bg-gray-100 text-gray-800 placeholder-gray-500 border-gray-300"
                    : "bg-white/20 text-white placeholder-white/70 border-white/30"
                } focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300`}
              />
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
                className={`${textColor} hover:text-red-600 font-medium transition-colors`}
              >
                {name}
              </Link>
            ))}
          </div>

          {userInfo?.phone ? (
            <>
              <img
                className="w-12 h-12 rounded-full"
                src={
                  userInfo?.profile_picture ||
                  "https://i.ibb.co.com/bjmC1HXM/profile.png"
                }
              />
              <button onClick={() => logouthandel()}>Logout</button>
            </>
          ) : (
            <button
              onClick={() => setOpenLogin(true)}
              className={`hidden cursor-pointer md:flex items-center gap-2 px-4 py-2 rounded-full transition-all shadow-sm ${
                isScrolled || mobileMenuOpen
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Login</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 ${textColor}`}
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

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-3 bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="md:hidden">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
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
                  className="text-gray-800 hover:bg-gray-100 px-4 py-2 rounded transition-colors"
                >
                  {name}
                </Link>
              ))}
              {userInfo?.phone ? (
                <>
                  <img
                    className="w-12 h-12 rounded-full"
                    src={
                      userInfo?.phone ||
                      "https://i.ibb.co.com/bjmC1HXM/profile.png"
                    }
                  />
                </>
              ) : (
                <button
                  onClick={() => setOpenLogin(true)}
                  className="flex cursor-pointer items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all mt-2 shadow"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Modals */}
      <LoginModal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onOpenSignUp={() => {
          setOpenLogin(false);
          // slight delay so close animation runs (optional)
          setTimeout(() => setOpenSignUp(true), 120);
        }}
        onLogin={async () => {}}
      />

      <SignUpModal open={openSignUp} onClose={() => setOpenSignUp(false)} />
    </>
  );
}
