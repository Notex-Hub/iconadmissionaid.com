
import Navbar from "../Pages/Home/Navbar/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "../Pages/Home/Home/Home";

const MainLayout = () => {
    return (
        <div >
                <ToastContainer position="top-right" autoClose={3000} />
        <Navbar/>
        <Home/>
  
        </div>
    );
};

export default MainLayout;