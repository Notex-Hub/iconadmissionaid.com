import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";
import Courses from "../Pages/Courses/Courses";
import Books from "../Pages/Books/Books";
import FreeClass from "../Pages/FreeClass/FreeClass";
import FreeTest from "../Pages/FreeTest/FreeTest";
import CourseDetailsPage from "../Pages/CourseDetails/CourseDetails";
import ScrollToTop from "../Ui/ScrollToTop";
import BookDetails from "../Pages/BookDetails/BookDetails";
import Dashboard from "../Pages/Dashboard/Dashboard";
import DashboardLayout from "../Layout/DashboardLayout";
import MyCourse from "../Components/Dashboard/MyCourse/MyCourse";
import BuyCourse from "../Pages/BuyCourse/BuyCourse";
import BuyBookForm from "../Pages/BookDetails/BuyBookForm";
import CourseModulesPage from "../Components/Dashboard/MyCourse/CourseModulesPage";

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
      , {
        path: "/book/:slug",
        element: <ScrollToTop>
          <BookDetails />
        </ScrollToTop>
      }
      , {
        path: "/enroll/:slug",
        element: <ScrollToTop>
          <BuyCourse />
        </ScrollToTop>
      }
      , {
        path: "/buy/book/:slug",
        element: <ScrollToTop>
          <BuyBookForm/>
        </ScrollToTop>
      }
    ],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <Dashboard />
      },
       {
        path: "my-courses",
        element: <ScrollToTop>
          <MyCourse />
        </ScrollToTop>

      },
       {
        path:"course/modules/:slug",
        element: <ScrollToTop>
          <CourseModulesPage  />
        </ScrollToTop>

      }
    ]
  }
]);
