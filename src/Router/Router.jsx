import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import DashboardLayout from "../Layout/DashboardLayout";
import Home from "../Pages/Home/Home/Home";
import CafeteriaMenu from "../Pages/Cafeteria/Cafeteria/CafeteriaMenu";
import BusSchedule from "../Pages/Bus/Bus/BusSchedule";




export const router = createBrowserRouter([
    {
        path:"/",
        element:<MainLayout/>,
        children:[
            {
                path:'/',
                element:<Home/>
            },
       
         {
                path:'/cafeteria',
                element:<CafeteriaMenu/>
            },{
                path:'/busSchedule',
                element:<BusSchedule/>
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