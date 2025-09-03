import type { RouteObject } from 'react-router-dom';
import UserLayout from '@/layouts/UserLayout';
import HomePage from '@/pages/HomePage';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import UserProfilePage from "@/pages/user/UserProfilePage.tsx";

export const userRoutes: RouteObject[] = [
	{
		element: <UserLayout />,
		children: [
			{ path: '/', element: <HomePage /> },
			{ path: '/login', element: <Login /> },
			{ path: '/register', element: <Register /> },
			{ path: '/me', element: <UserProfilePage /> }
		],
	},
];
