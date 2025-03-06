import AdminHeader from "../AdminDashboardHeader/AdminHeader";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import AdminTab from "../AdminTab/AdminTab";

const Admin = () => {
    return (
        <div>
            <AdminNavbar/>
            <div className="container mx-auto p-4">
                <AdminHeader/>
                <AdminTab/>
            </div>
        </div>
    );
};

export default Admin;