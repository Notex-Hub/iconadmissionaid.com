import { Link } from "react-router-dom";


const Profile = () => {
    return (
        <div>
            <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-8 rounded-full">
              <img src="/placeholder-avatar.jpg" alt="User" />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-56">
            <li className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-gray-500">john.doe@example.com</p>
              </div>
            </li>
            <li><hr className="my-1" /></li>
            <li>
              <a onClick={() => console.log('Opening dashboard UI')}>Dashboard</a>
            </li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li><hr className="my-1" /></li>
            <li><Link to="/logout">Log out</Link></li>
          </ul>
        </div>
        </div>
    );
};

export default Profile;