import { Outlet } from "react-router-dom";
import Navbar from "../Pages/Home/Navbar/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = () => {
    return (
        <div >
                <ToastContainer position="top-right" autoClose={3000} />
        <Navbar/>
         <Outlet/>
        </div>
    );
};

export default MainLayout;