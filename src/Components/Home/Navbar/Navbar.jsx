/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../../assets/Home/logo.png";
import SignUpModal from "../../Auth/SignUpModal/SignUpModal";
import LoginModal from "../../Auth/LoginModal/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedOut } from "../../../../redux/Features/Api/Auth/AuthSlice";

/* ---------- small helpers (outside main export) ---------- */

function useOutsideAlerter(ref, onOutside) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutside();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, onOutside]);
}

/* Profile dropdown used on desktop */
function ProfileMenu({ userInfo, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutsideAlerter(ref, () => setOpen(false));

  const avatar = userInfo?.profile_picture || "https://i.ibb.co/bjmC1HXM/profile.png";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-3 focus:outline-none cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <img
          src={avatar}
          alt={userInfo?.name || "User avatar"}
          className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
        />
        <div className="hidden md:flex flex-col text-left">
          <span className="text-sm font-medium text-white">{userInfo?.name || "Guest"}</span>
          <span className="text-xs text-white/80">{userInfo?.phone || ""}</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""} text-white`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-lg ring-1 ring-black/5 py-2 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-gray-800">{userInfo?.name || "Guest"}</p>
                <p className="text-xs text-gray-500">{userInfo?.email || userInfo?.phone || "No contact"}</p>
              </div>
            </div>
          </div>

          <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>Dashboard</Link>
          <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>My Profile</Link>
          <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>Settings</Link>
          <Link to="/my-courses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)}>My Courses</Link>

          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

/* Mobile profile block shown inside mobile menu */
function MobileProfileMenu({ userInfo, onLogout, onClose }) {
  const avatar = userInfo?.profile_picture || "https://i.ibb.co/bjmC1HXM/profile.png";
  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <div className="flex items-center gap-3 px-2">
        <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold text-gray-800">{userInfo?.name || "Guest"}</p>
          <p className="text-xs text-gray-500">{userInfo?.email || userInfo?.phone || "No contact"}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-col px-2 gap-2">
        <Link to="/profile" onClick={onClose} className="block px-3 py-2 rounded hover:bg-gray-100">My Profile</Link>
        <Link to="/settings" onClick={onClose} className="block px-3 py-2 rounded hover:bg-gray-100">Settings</Link>
        <Link to="/my-courses" onClick={onClose} className="block px-3 py-2 rounded hover:bg-gray-100">My Courses</Link>
        <button onClick={() => { onClose(); onLogout(); }} className="w-full text-left px-3 py-2 rounded text-red-600 hover:bg-gray-100">Logout</button>
      </div>
    </div>
  );
}

/* ---------- main Navbar component ---------- */

export default function Navbar({ onToggleSidebar } = {}) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  // If user is on /courses and there's a q param, prefill search box
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") ?? "";
    if (location.pathname.startsWith("/courses")) setSearchQuery(q);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = (searchQuery || "").trim();
    if (q.length) {
      navigate(`/courses?q=${encodeURIComponent(q)}`);
    } else {
      navigate(`/courses`);
    }
    setMobileMenuOpen(false);
  };

  const bgColor = "bg-red-600 shadow-md";
  const textColor = "text-white";

  const logouthandel = async () => {
    dispatch(userLoggedOut());
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 px-4 py-3 transition-all duration-300 ${bgColor}`}>
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* optional sidebar toggle */}
            {onToggleSidebar && (
              <button onClick={onToggleSidebar} className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 mr-2" aria-label="Toggle sidebar">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="logo" className="w-20 h-10 md:w-24 md:h-12" />
            </Link>
          </div>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden md:flex">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, topics, universities..."
                aria-label="Search courses"
                className="w-full px-4 py-2 pr-10 rounded-full border bg-white text-gray-800 placeholder-gray-500 border-gray-300 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-red-600 text-white px-3 py-1.5 rounded-full shadow hover:bg-red-700"
                aria-label="Search"
              >
                Search
              </button>
            </div>
          </form>

          <div className="hidden lg:flex items-center gap-6">
            {[{ name: "Home", path: "/" }, { name: "Courses", path: "/courses" }, { name: "Books", path: "/books" }, { name: "FREE CLASS", path: "/free-class" }, { name: "FREE TEST", path: "/free-test" }].map(({ name, path }) => (
              <Link key={name} to={path} className={`${textColor} hover:text-gray-200 font-medium transition-colors`}>
                {name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {userInfo?.phone ? (
              <ProfileMenu userInfo={userInfo} onLogout={logouthandel} />
            ) : (
              <button
                onClick={() => setOpenLogin(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white text-red-600 hover:bg-gray-100 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Login</span>
              </button>
            )}

            {/* mobile menu toggle */}
            <button onClick={() => setMobileMenuOpen((s) => !s)} className={`lg:hidden p-2 ${textColor}`} aria-label="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-3 bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
            <form onSubmit={handleSearch} className="md:hidden">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 text-white px-3 py-1.5 rounded-full">Go</button>
              </div>
            </form>

            <div className="flex flex-col gap-2">
              {[{ name: "Home", path: "/" }, { name: "Courses", path: "/courses" }, { name: "Books", path: "/books" }, { name: "FREE CLASS", path: "/free-class" }, { name: "FREE TEST", path: "/free-test" }].map(({ name, path }) => (
                <Link key={name} to={path} onClick={() => setMobileMenuOpen(false)} className="text-gray-800 hover:bg-gray-100 px-4 py-2 rounded transition-colors">
                  {name}
                </Link>
              ))}

              {userInfo?.phone ? (
                <MobileProfileMenu userInfo={userInfo} onLogout={logouthandel} onClose={() => setMobileMenuOpen(false)} />
              ) : (
                <button onClick={() => { setOpenLogin(true); setMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all mt-2 shadow">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} onLogin={async () => {}} onOpenSignUp={() => { setOpenLogin(false); setTimeout(() => setOpenSignUp(true), 120); }} />
      <SignUpModal open={openSignUp} onClose={() => setOpenSignUp(false)} />
    </>
  );
}
