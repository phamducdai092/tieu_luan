// import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

export default function UserLayout() {
	return (
		<div className="flex min-h-screen">
			{/* Optional sidebar */}
			{/* <UserSidebar /> */}

			<div className="flex-1 flex flex-col">
				{/* <UserNavbar /> */}
				<main className="flex-1 container mx-auto px-4 py-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
