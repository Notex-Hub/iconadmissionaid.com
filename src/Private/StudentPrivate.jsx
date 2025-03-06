import { Navigate, useLocation } from "react-router-dom";
import useProfile from "../Hooks/useProfile";
import Loader from "../Ui/Loader";

// eslint-disable-next-line react/prop-types
const StudentPrivate = ({ children }) => {
    const { profile, isLoading } = useProfile();
    const location = useLocation();
    // console.log(profile);

    // Show loader while user data is loading
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <Loader/>
        </div>;
    }

    // If not logged in, redirect to login
    if (!profile) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // If user is not admin, block access and redirect (e.g., to home or unauthorized page)
    if (profile.role !== "student") {
        return <Navigate to="/unauthorized" replace />;
    }

    // If user is admin, allow access
    return children;
};

export default StudentPrivate;