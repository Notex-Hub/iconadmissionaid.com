import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import DashboardLayout from "../Layout/DashboardLayout";
import CafeteriaMenu from "../Pages/Student/Cafeteria/Cafeteria/CafeteriaMenu";
import Home from "../Pages/Student/Home/Home/Home";
import BusSchedule from "../Pages/Student/Bus/Bus/BusSchedule";
import ClassSchedule from "../Pages/Student/Class/Class/ClassSchedule";
import Login from "../Components/Login/Login";
import CantenStaff from "../Pages/CantenStaff/CantenStaff/CantenStaff";
import StudentPrivate from "../Private/StudentPrivate";
import Unauthorized from "../Components/Unauthorized/Unauthorized";
import Faculty from "../Pages/Faculty/Faculty/Faculty";






export const router = createBrowserRouter([
    {
        path:"/",
        element:<MainLayout/>,
        children:[{
            path:'/',
            element:<Login/>
        },
            {
                path:'/student-dashboard',
                element:<StudentPrivate><Home/></StudentPrivate>
            },
       
         {
                path:'/cafeteria',
                element:<CafeteriaMenu/>
            },{
                path:'/busSchedule',
                element:<BusSchedule/>
            },{
                path:'/classSchedule',
                element:<ClassSchedule/>
            },{
                path:'/cantenstaff',
                element:<CantenStaff/>
            },{
                path:'/unauthorized',
                element:<Unauthorized/>
            },{
                path:'/faculty-dashboard',
                element:<Faculty/>
            }
          
        ]
    },
    {
        path:'/admin-dashboard',
        element:<DashboardLayout/>,
        children:[
            {
                path:'/admin-dashboard',
                element:<h1>Admin Dashboard</h1>
            }
        ]
    },
])