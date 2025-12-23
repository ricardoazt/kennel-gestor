import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarCollapsed(prev => !prev);
	};

	return (
		<div className="relative flex h-screen w-full flex-col overflow-hidden" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
			<Header />
			<div className="flex flex-1 overflow-hidden" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
				<Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
				<main className="flex-1 overflow-y-auto p-6 bg-background-light" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', backgroundColor: 'var(--background-light)' }}>
					<div className="max-w-7xl mx-auto" style={{ maxWidth: '80rem', margin: '0 auto' }}>
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
