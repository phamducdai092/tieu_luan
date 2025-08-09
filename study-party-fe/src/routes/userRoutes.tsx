import type { RouteObject } from 'react-router-dom';
import UserLayout from '@/layouts/UserLayout';
import HomePage from '@/pages/HomePage';

export const userRoutes: RouteObject[] = [
	{
		element: <UserLayout />,
		children: [
			{ path: '/', element: <HomePage /> },
		],
	},
];
