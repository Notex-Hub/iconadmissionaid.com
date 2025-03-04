
import Navbar from "../Pages/Home/Navbar/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = () => {
    return (
        <div >
                <ToastContainer position="top-right" autoClose={3000} />
        <Navbar/>
  
        </div>
    );
};

export default MainLayout;