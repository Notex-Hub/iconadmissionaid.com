import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";
import Courses from "../Pages/Courses/Courses";
import Books from "../Pages/Books/Books";
import FreeClass from "../Pages/FreeClass/FreeClass";
import FreeTest from "../Pages/FreeTest/FreeTest";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/books",
        element: <Books/>,
      },
      {
        path: "/courses",
        element: <Courses />,
      },
      {
        path: "/free-class",
        element: <FreeClass />,
      },
      {
        path: "/free-test",
        element: <FreeTest />,
      },
    ],
  },
]);
