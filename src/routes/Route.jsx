import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";

// 컴포넌트
import App from "../App.jsx";
import Monitoring from "../components/monitoring/Monitoring.jsx";
import Login from "../components/auth/Login.jsx";
import ReservationList from "../components/reservation/ReservationList.jsx";
import DriverList from "../components/drivers/DriverList.jsx";
import EmployeeList from "../components/employees/EmployeeList.jsx";
import AnnouncementAdmin from "../components/Announcement/AnnouncementAdmin.jsx";
import NoticeList from "../components/notice/NoticeList.jsx";
import FaqList from "../components/faq/FaqList.jsx";
import PricingPage from "../components/pricing/PricingPage.jsx";
import ImageManagePage from "../components/image/ImageManagePage.jsx";
import StoreList from "../components/store/StoreList.jsx";
import UserList from "../components/users/UserList.jsx";


const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        loader: async () => {
          return redirect('/login');
        }
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/monitoring",
        element: <Monitoring />,
      },
      {
        path: "/reservations",
        element: <ReservationList />,
      },
      {
        path: "/drivers",
        element: <DriverList />,
      },
      {
        path: "/employees",
        element: <EmployeeList />,
      },
      {
        path: "/users",
        element: <UserList />,
      },
      {
        path: "/notice",
        element: <NoticeList />,
      },
      {
        path: "/faq",
        element: <FaqList />,
      },
      {
        path: "/pricing",
        element: <PricingPage />,
      },
      {
        path: "/image",
        element: <ImageManagePage />,
      },
      {
        path: "/store",
        element: <StoreList />,
      },
      {
        path: "/announcement",
        element: <AnnouncementAdmin />,
      }
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}