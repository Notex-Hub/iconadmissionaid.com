import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import DashboardLayout from "../Layout/DashboardLayout";
import CafeteriaMenu from "../Pages/Student/Cafeteria/Cafeteria/CafeteriaMenu";
import Home from "../Pages/Student/Home/Home/Home";
import BusSchedule from "../Pages/Student/Bus/Bus/BusSchedule";
import ClassSchedule from "../Pages/Student/Class/Class/ClassSchedule";
import Login from "../Components/Login/Login";






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
                element:<Home/>
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
    }
])