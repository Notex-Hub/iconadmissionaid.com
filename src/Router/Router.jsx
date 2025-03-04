import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import ProfilePage from "../Pages/profile/ProfilePage";
import DashboardLayout from "../Layout/DashboardLayout";




export const router = createBrowserRouter([
    {
        path:"/",
        element:<MainLayout/>,
        children:[
       
            {
                path:"/profile",
                element:<ProfilePage/>
            },
          
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