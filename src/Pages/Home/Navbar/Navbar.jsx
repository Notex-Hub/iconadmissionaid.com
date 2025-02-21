import  { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon } from 'lucide-react';
import { LuBrainCircuit } from "react-icons/lu";


const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  //  Sign Up Modal 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false); // New state to toggle between Sign Up and Login

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isLogin ? 'Logging in with:' : 'Signing up with:', formData);
    setIsModalOpen(false);
  };
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between">
      <Link className="flex items-center justify-center gap-1" to="#">
        <p className='text-2xl'><LuBrainCircuit/></p>
        <span className="font-bold text-lg">NeoMatch</span>
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
            <Link to="#">Find Jobs</Link>
          </li>
          <li>
            <Link to="#">Skill Matching</Link>
          </li>
          <li>
            <Link to="#">Mock Interview</Link>
          </li>
        
          <li>
            <Link to="#">Career Insights</Link>
          </li>
          <li>
            <Link to="#">Contact</Link>
          </li>
          <button  onClick={() => setIsModalOpen(true)} className='text-sm font-medium hover:cursor-pointer px-2 py-1 bg-black text-white rounded-md'>  {isLogin ? 'Login' : 'Sign Up'}</button>
        </ul>
      )}
    </div>

      <nav className="hidden lg:flex items-center gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">Home</Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">Find Jobs</Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">Skill Matching</Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">Mock Interview</Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">Career Insights</Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">Contact</Link>
        {/* Sign Up Modal */}
        <button  onClick={() => setIsModalOpen(true)} className='text-sm font-medium hover:cursor-pointer px-2 py-1 bg-black text-white rounded-md'>  {isLogin ? 'Login' : 'Sign Up'}</button>
    
      

        <button className="btn btn-ghost btn-circle">
          <BellIcon className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </button>
      </nav>
      {/* Sign Up and Login Form */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative transition-all duration-500 ease-in-out">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setIsModalOpen(false)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold text-center mb-4">
              {isLogin ? 'Login' : 'Sign Up'}
           
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
              <button type="submit" className="text-white px-2 py-2 rounded-md bg-black hover:cursor-pointer w-full">
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>
            <div className="modal-action">
              <button
                className="text-sm hover:underline hover:cursor-pointer"
                onClick={() => setIsLogin(!isLogin)} // Toggle between Login and Sign Up
              >
                {isLogin ? 'Create an account' : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        </div>
      )}  
    </header>
  );
};

export default Navbar;


 {/* <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-8 rounded-full">
              <img src="/placeholder-avatar.jpg" alt="User" />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-56">
            <li className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-gray-500">john.doe@example.com</p>
              </div>
            </li>
            <li><hr className="my-1" /></li>
            <li>
              <a onClick={() => console.log('Opening dashboard UI')}>Dashboard</a>
            </li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li><hr className="my-1" /></li>
            <li><Link to="/logout">Log out</Link></li>
          </ul>
        </div> */}