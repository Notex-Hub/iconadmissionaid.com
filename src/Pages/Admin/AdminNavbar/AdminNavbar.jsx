import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BellIcon } from "lucide-react";
import { toast } from "react-toastify";
import useProfile from "../../../Hooks/useProfile";
import Profile from "../../Student/Home/Navbar/Profile";



const AdminNavbar = () => {
    // eslint-disable-next-line no-unused-vars
    const { profile,refetch } = useProfile();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

   const logout = () => {
        localStorage.removeItem("token"); 
        navigate("/"); 
        refetch();
        window.location.reload();
        toast.success('Logout Success')
      };
    



  return (
    <div className="shadow w-full">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between container mx-auto ">
        <Link className="flex items-center justify-center gap-1" to="#">
          <span className="font-bold text-lg">UniHub</span>
        </Link>
        <div className="lg:hidden " ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn btn-ghost btn-circle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          {menuOpen && (
            <ul className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 absolute right-1 z-10">
              <li>
                <Link to="#">Home</Link>
              </li>
              <li>
                <Link to="#">Bus Schedule </Link>
              </li>
              <li>
                <Link to="#">Class Schedule</Link>
              </li>
              <li>
                <Link to="#">Events & Clubs</Link>
              </li>
              <li>
                <Link to="#">Campus Map </Link>
              </li>
            </ul>
          )}
        </div>

        <nav className="hidden lg:flex items-center gap-4 sm:gap-6">
          <Link
            to="/dashboard"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Home
          </Link>
          <Link
            to="/courses"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
           Courses
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/students"
          >
          Students
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="/research"
          >
           Research
          </Link>
        

          <Profile logout={logout} />
          <button className="btn btn-ghost btn-circle">
            <BellIcon className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </button>
        </nav>
      </header>
    </div>
  );
};

export default AdminNavbar;
