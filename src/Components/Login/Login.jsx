import  { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const Login = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">University App Login</h1>

      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={() => setIsLoginOpen(true)}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
        >
          Login
        </button>
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="w-full py-2 px-4 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
        >
          Register
        </button>
      </div>

      {/* Login & Register Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </div>
  );
};

export default Login;
