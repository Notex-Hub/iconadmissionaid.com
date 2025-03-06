import StudentDashboardHeade from "../StudentDashboardHeader/StudentDashboardHeade";
import StudentNavbar from "../StudentNavbar/StudentNavbar";
import StudentTab from "../StudentTab/StudentTab";


const StudentDashboard = () => {
    return (
        <div className="">
            <StudentNavbar/>
           <div className="container mx-auto p-4">
           <StudentDashboardHeade/>
           <StudentTab/>
        
           </div>
            
        </div>
    );
};

export default StudentDashboard;