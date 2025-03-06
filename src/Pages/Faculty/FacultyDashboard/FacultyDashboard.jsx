import FacultyHeader from "./FacultyHeader";
import ProfessorTabs from "./ProfessorTab/ProfessorTabs";

const FacultyDashboard = () => {
    return (
        <div className="container mx-auto p-4">
<FacultyHeader/>
<ProfessorTabs/>

        </div>
    );
};

export default FacultyDashboard;