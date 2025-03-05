import { useEffect, useRef, useState } from 'react';
import {  Link, useNavigate } from 'react-router-dom';
import { BellIcon } from 'lucide-react';
import { toast } from 'react-toastify';

import Profile from './Profile';
const  profile = {
 name:'ripon'
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  const navigate = useNavigate(); 
 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false); // New state to toggle between Sign Up and Login

  // Menu toggle logic
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle login logic


  const handleLogin = async (e) => {
    e.preventDefault();
    const email = formData.email;
    const password = formData.password;
    const data = { email, password };
 
  
    try {
      const response = await axiosPublic.post('/auth/login', data);
  
      // Log the response to check the structure
      console.log('Login response:', response);
  
      // Check if response.data and response.data.data are defined
      if (response.data && response.data.data) {
        const { token, user } = response.data.data;
  
        if (token && user) {
          localStorage.setItem('token', token);
  
          // Using toast instead of alert
          toast.success(`Welcome, ${user.email}! 🎉`);
          console.log('Logged in user:', user);
        } else {
          toast.error('User data is missing in the response.');
          console.error('Response missing user data:', response);
        }
      } else {
        toast.error('Invalid response structure');
        console.error('Unexpected response structure:', response);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed!';
      toast.error(errorMessage);
      console.error('Login error:', err);
    }
  
    setIsModalOpen(false);
    refetch();
  };
  
  // Handle sign-up logic

  const handleSignUp = async (e) => {
    e.preventDefault();
    const email = formData.email;
    const name = formData.name;
    const password = formData.password;
    const role = 'user';
    const isBlocked = false;
    const data = { email, password, name, role, isBlocked };
  
    try {
      // Send sign-up data to your API
      const response = await axiosPublic.post('/auth/register', data);
      const { token, user, message } = response.data;
  
      // Store JWT token for auto-login
      localStorage.setItem('token', token);
  
      // Success toast
      toast.success(message || `Welcome, ${user.email}! 🎉 You are now logged in.`);
  
      console.log('Signed up and logged in user:', user);
  
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Sign-up failed!';
      toast.error(errorMessage);
      console.error('Sign-up error:', err);
    }
  };

  
    const logout = () => {
      localStorage.removeItem("token"); 
      navigate("/"); 
      refetch();
      window.location.reload();
    };
  

  
  return (
<div className='shadow w-full'>
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
              <Link to="#">Cafeteria</Link>
            </li>
            <li>
              <Link to="#">Bus Schedule              </Link>
            </li>
            <li>
              <Link to="#">Class Schedule</Link>
            </li>
            <li>
              <Link to="#">Events & Clubs</Link>
            </li>
            <li>
              <Link to="#">Campus Map         </Link>
            </li>
            <button
              onClick={() => setIsModalOpen(true)}
              className='text-sm font-medium hover:cursor-pointer px-2 py-1 bg-black text-white rounded-md'>
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </ul>
        )}
      </div>

      <nav className="hidden lg:flex items-center gap-4 sm:gap-6">
     
        <Link to='/' className="text-sm font-medium hover:underline underline-offset-4">Home</Link>
        <Link to='/cafeteria' className="text-sm font-medium hover:underline underline-offset-4">Cafeteria</Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" to="/busSchedule">Bus Schedule  </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" to="/classSchedule">Class Schedule</Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">Events & Clubs</Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" to="#">Campus Map  </Link>
        {/* Sign Up Modal */}
       {
        profile && profile.name ? <Profile logout={logout} /> : <button  onClick={() => setIsModalOpen(true)} className='text-sm font-medium hover:cursor-pointer px-2 py-1 bg-black text-white rounded-md'>  {isLogin ? 'Login' : 'Sign Up'}</button> 

       }

    
      

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
            <form
              onSubmit={isLogin ? handleLogin : handleSignUp}
              className="space-y-4"
            >
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
              <button
                type="submit"
                className="text-white px-2 py-2 rounded-md bg-black hover:cursor-pointer w-full"
              >
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
</div>
  );
};

export default Navbar;
