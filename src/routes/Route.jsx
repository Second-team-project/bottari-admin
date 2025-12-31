import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";

// 컴포넌트
import App from "../App.jsx";
import Monitoring from "../components/monitoring/Monitoring.jsx";
import Login from "../components/auth/Login.jsx";
import ReservationList from "../components/reservation/ReservationList.jsx";

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
        path: "/ReservationList",
        element: <ReservationList />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}