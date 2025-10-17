/* DashboardLayout.jsx */
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Dashboard/Dashboard/Sidebar";
import Navbar from "../Components/Home/Navbar/Navbar";
import Footer from "./Footer";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <main
          className="flex-1  pt-20"
          style={{
            height: "calc(100vh - 80px)",
            overflow: "auto",
          }}
        >
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
