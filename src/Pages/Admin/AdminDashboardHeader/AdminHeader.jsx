import RealTimeDate from "../../../Components/RealTimeDate";
import useProfile from "../../../Hooks/useProfile";



const AdminHeader = () => {
    const { profile } = useProfile();
    return (
        <div>
            <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">Welcome, {profile?.name}</h2>
      <div className="flex items-center space-x-2">
       <RealTimeDate/>
        <button 
          
          color="primary" 
          
          className="text-white"
        >
          Download Report
        </button>
      </div>
    </div>
        </div>
    );
};

export default AdminHeader;