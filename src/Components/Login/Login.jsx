import { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { toast } from "react-toastify"; // for toast notifications
import { axiosPublic } from "../../Hooks/usePublic"; // Assuming you're using axios for API requests
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate =useNavigate()
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Form state for email and password
  const [loginData, setLoginData] = useState({
    gmail: "",
    password: ""
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleLogin =  async(e)  =>{
    e.preventDefault();
    if(loginData.password.length < 6){
        toast.warning("Your Password must be at least 6 characters long")
        return;
    } 
    
   
  
      try {
        const response = await axiosPublic.post('/auth/login', loginData);
    
        // Log the response to check the structure
        // console.log('Login response:', response);
    
        // Check if response.data and response.data.data are defined
        if (response.data && response.data.data) {
          const { token, user } = response.data.data;
    
          if (token && user) {
            localStorage.setItem('token', token);
    
    
            if (user?.role === 'student') {
                navigate('/student-dashboard')
              } if (user?.role === 'faculty') {
                navigate('/faculty-dashboard')
              }

            //   else if (user?.accountType === 'admin') {
            //     navigate('/admin-dashboard')
                
            //   }
            // //   else if (user?.accountType === 'agent') {
            //     navigate('/agent-dashboard')
                
            //   }
            toast.success(`Welcome, ${user?.name}! 🎉`);

            
          } else {
            toast.error('User data is missing in the response.');
            console.error('Response missing user data:', response);
          }
        } else {
          toast.error('Invalid response structure');
          console.error('Unexpected response structure:', response);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Login failed! Please provide valid login details.';
        toast.error(errorMessage);
        console.error('Login error:', err);
      }


   

    }
  
  


  




  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">University App Login</h1>

      {/* Login Form */}
      <form
        className="mt-4 space-y-4 bg-white shadow px-5 py-5 rounded-md"
        onSubmit={handleLogin}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="gmail"
            value={loginData.gmail}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
        <p
          onClick={() => setIsRegisterOpen(true)}
          className="text-green-500 my-1 cursor-pointer text-center"
        >
          Register
        </p>
      </form>

      {/* Login & Register Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        setIsRegisterOpen={setIsRegisterOpen}
      />
    </div>
  );
};

export default Login;
