import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import CafeteriaMenu from "../Pages/Student/Cafeteria/Cafeteria/CafeteriaMenu";
import Home from "../Pages/Student/Home/Home/Home";
import BusSchedule from "../Pages/Student/Bus/Bus/BusSchedule";
import ClassSchedule from "../Pages/Student/Class/Class/ClassSchedule";
import Login from "../Components/Login/Login";
import CantenStaff from "../Pages/CantenStaff/CantenStaff/CantenStaff";
import StudentPrivate from "../Private/StudentPrivate";
import Unauthorized from "../Components/Unauthorized/Unauthorized";
import Faculty from "../Pages/Faculty/Faculty/Faculty";
import StudentDashboard from "../Pages/StudentDashboard/StudentDashboard/StudentDashboard";
import FacultyPrivate from "../Private/FacultyPrivate";
import Admin from "../Pages/Admin/Admin/Admin";
import Meals from "../Pages/CantenStaff/Meals/Meals";
import Order from "../Pages/CantenStaff/Order/Order";
import Event from "../Pages/Student/Event/Event";
import Courses from "../Pages/Faculty/Courses/Courses";
import Students from "../Pages/Faculty/Students/Students";
import Reasrch from "../Pages/Faculty/Research/Reasrch";
import MyOrder from "../Pages/StudentDashboard/MyOrder/MyOrder";
import ProfilePage from "../Pages/Student/Home/profile/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: <Home />,
      },

      {
        path: "/cafeteria",
        element: <CafeteriaMenu />,
      },
      {
        path: "/busSchedule",
        element: <BusSchedule />,
      },
      {
        path: "/classSchedule",
        element: <ClassSchedule />,
      },
      {
        path: "/cantenstaff",
        element: <CantenStaff />,
      },
      {
        path: "/meals",
        element: <Meals />,
      },{
        path:'/events',
        element:<Event/>
      },{
        path:'/courses',
        element:<Courses/>
      },{
        path:'/students',
        element:<Students/>
      },{
        path:'/research',
        element:<Reasrch/>
      },
      {
        path: '/canteen-staff/order',
        element: <Order />
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "/faculty-dashboard",
        element: (
          <FacultyPrivate>
            <Faculty />
          </FacultyPrivate>
        ),
      },
      {
        path: "/student-dashboard",
        element: (
          <StudentPrivate>
            <StudentDashboard />
          </StudentPrivate>
        ),
      },
      {
        path: "/admin-dashboard",
        element: <Admin />,
      },
      {
        path: '/my-orders',
        element: <MyOrder />
      },
      {
        path: '/std-profile',
        element: <ProfilePage />
      }
    ],
  },
]);
