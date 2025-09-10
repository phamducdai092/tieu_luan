import type {RouteObject} from "react-router-dom";
import MainLayout from "@/layouts/Layout.tsx";
import AdminLayout from "@/layouts/AdminLayout";

import HomePage from "@/pages/HomePage";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import UserProfilePage from "@/pages/user/UserProfilePage";
import AdminDashboard from "@/pages/admin/AdminDashboard";

import PrivateRoute from "@/routes/PrivateRoute";
import AdminRoute from "@/routes/AdminRoute";
import NotFound from "@/pages/status/NotFound";

export const routes: RouteObject[] = [
    // NHÁNH KHÔNG SIDEBAR
    {path: "/login", element: <Login/>},
    {path: "/register", element: <Register/>},

    // NHÁNH APP CÓ SIDEBAR (MainLayout DUY NHẤT)
    {
        path: "/",
        element: <MainLayout/>,
        children: [
            {index: true, element: <HomePage/>},
            {
                element: <PrivateRoute/>,
                children: [
                    {path: "me", element: <UserProfilePage/>},
                ],
            },
            // … thêm các page khác của app ở đây
        ],
    },

    // NHÁNH ADMIN (layout riêng, KHÔNG dùng MainLayout)
    {
        path: "/admin",
        element: <AdminLayout/>,
        children: [
            {
                element: <AdminRoute/>,
                children: [
                    {index: true, element: <AdminDashboard/>},
                    // … admin pages
                ],
            },
        ],
    },

    // 404 CHUNG (1 cái duy nhất)
    {path: "*", element: <NotFound/>},
];
