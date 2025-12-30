import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 컴포넌트
import App from "../App.jsx";
import Monitoring from "../components/monitoring/Monitoring.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/monitoring",
        element: <Monitoring />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}