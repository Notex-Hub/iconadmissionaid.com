import { Link,  } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import useProfile from "../../../../Hooks/useProfile";




// eslint-disable-next-line react/prop-types
const Profile = ({logout}) => {
  const { profile } = useProfile();
  let dashboardRoute = "/dashboard";
  if (profile?.role === "admin") {
    dashboardRoute = "/admin-dashboard";
  } else if (profile?.role === "faculty") {
    dashboardRoute = "/faculty-dashboard";
  } else if (profile?.role  === "student") {
    dashboardRoute = "/student-dashboard";
  }


    return (
        <div>
            <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-8 rounded-full">
              <FaRegUserCircle className="text-3xl" />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-56">
            <li className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.name}</p>
                <p className="text-xs leading-none text-gray-500">{profile?.gmail}</p>
              </div>
            </li>
            <li><hr className="my-1" /></li>
            <li>
              <Link to={dashboardRoute}><a onClick={() => console.log('Opening dashboard UI')}>Dashboard</a></Link>
            </li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li><hr className="my-1" /></li>
            <li><Link onClick={logout}>Log out</Link></li>
          </ul>
        </div>
        </div>
    );
};

export default Profile;