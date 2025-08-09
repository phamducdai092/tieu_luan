import type { RouteObject } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';

export const adminRoutes: RouteObject[] = [
	{
		element: <AdminLayout />,
		children: [
			{ path: '/admin', element: <AdminDashboard /> },
		],
	},
];
