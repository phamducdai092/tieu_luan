import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
	return (
		<div className="flex min-h-screen bg-gray-50 text-gray-900">
			{/* Sidebar chiếm chiều ngang bên trái */}
			{/* <AdminSidebar /> */}

			{/* Main content bên phải */}
			<div className="flex-1 flex flex-col">
				{/* <AdminNavbar /> */}
				<main className="flex-1 p-6 overflow-y-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
