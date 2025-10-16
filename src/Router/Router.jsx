import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";
import Courses from "../Pages/Courses/Courses";
import Books from "../Pages/Books/Books";
import FreeClass from "../Pages/FreeClass/FreeClass";
import FreeTest from "../Pages/FreeTest/FreeTest";
import CourseDetailsPage from "../Pages/CourseDetails/CourseDetails";
import ScrollToTop from "../Ui/ScrollToTop";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <ScrollToTop>
          <Home />
        </ScrollToTop>

      },
      {
        path: "/books",
        element: <ScrollToTop>
          <Books />
        </ScrollToTop>,
      },
      {
        path: "/courses",
        element: <ScrollToTop>
          <Courses />
        </ScrollToTop>,
      },
      {
        path: "/free-class",
        element: <ScrollToTop>
          <FreeClass />
        </ScrollToTop>
        ,
      },
      {
        path: "/free-test",
        element:
          <ScrollToTop>
            <FreeTest />
          </ScrollToTop>,
      }, {
        path: "/course/:slug",
        element: <ScrollToTop>
          <CourseDetailsPage />
        </ScrollToTop>
      }
    ],
  },
]);
