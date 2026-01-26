import type {RouteObject} from "react-router-dom";
import MainLayout from "@/layouts/MainLayout.tsx";
import AdminLayout from "@/layouts/AdminLayout";

import HomePage from "@/pages/home/HomePage.tsx";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import UserProfilePage from "@/pages/user/UserProfilePage";
import AdminDashboard from "@/pages/admin/AdminDashboard";

import PrivateRoute from "@/routes/PrivateRoute";
import AdminRoute from "@/routes/AdminRoute";
import NotFound from "@/pages/status/NotFound";
import RoomDetail from "@/pages/group/RoomDetail.tsx";
import RoomPage from "@/pages/group/RoomPage.tsx";
import {FlashcardsPage} from "@/pages/flashcard/FlashCardsPage.tsx";
import {DocumentsPage} from "@/pages/document/DocumentsPage.tsx";
import {lazy} from "react";
import AdminUsers from "@/components/features/admin/AdminUser.tsx";
import AdminGroups from "@/components/features/admin/AdminGroups.tsx";
import AdminFiles from "@/components/features/admin/AdminFiles.tsx";
import PublicProfilePage from "@/pages/user/PublicProfilePage.tsx";
import GroupListPage from "@/pages/group/RoomListPage.tsx";

const NotificationsPage = lazy(() => import("../pages/settings/NotificationPage.tsx"));
// const PrivacyPage = lazy(()=>import("../pages/settings/"));
// const ConnectionsPage = lazy(()=>import("./ConnectionsPage"));
// const AppearancePage = lazy(()=>import("./AppearancePage"));

export const routes: RouteObject[] = [

    {path: "/login", element: <Login/>},
    {path: "/register", element: <Register/>},

    {
        path: "/",
        element: <MainLayout/>,
        children: [
            {index: true, element: <HomePage/>},
            {
                element: <PrivateRoute/>,
                children: [
                    {path: "me", element: <UserProfilePage/>},
                    {path: "rooms", element: <RoomPage/>},
                    {path: "rooms/:slug", element: <RoomDetail/>},
                    {path: "flashcard", element: <FlashcardsPage/>},
                    {path: "docs", element: <DocumentsPage/>},
                    {path: "notifications", element: <NotificationsPage/>},
                    {path: "user/:userId", element: <PublicProfilePage/>},
                    {path: "groups/list/:type", element: <GroupListPage/>}
                ],
            },
        ],
    },

    {
        path: "/admin",
        element: <AdminLayout/>,
        children: [
            {
                element: <AdminRoute/>,
                children: [
                    {index: true, element: <AdminDashboard/>},
                    {path: "dashboard", element: <AdminDashboard/>},
                    {path: "users", element: <AdminUsers/>},
                    {path: "groups", element: <AdminGroups/>},
                    {path: "files", element: <AdminFiles/>},
                ],
            },
        ],
    },

    {path: "*", element: <NotFound/>},
];
