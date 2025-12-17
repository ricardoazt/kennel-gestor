import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
	const location = useLocation();
	const [expandedItems, setExpandedItems] = useState({
		'Cadastros': true
	});

	const toggleExpand = (name) => {
		setExpandedItems(prev => ({
			...prev,
			[name]: !prev[name]
		}));
	};

	const navItems = [
		{ name: 'Dashboard', icon: 'dashboard', path: '/' },
		{
			name: 'Cadastros',
			icon: 'folder_shared',
			path: '/cadastros',
			children: [
				{ name: 'Reservas', path: '/cadastros/reservas' },
				{ name: 'Clientes', path: '/cadastros/clientes' }
			]
		},
		{ name: 'Vendas', icon: 'shopping_cart', path: '/vendas' },
		{ name: 'Cães', icon: 'pets', path: '/caes' },
		{ name: 'Ninhadas', icon: 'grid_view', path: '/ninhadas' },
		{ name: 'Financeiro', icon: 'payments', path: '/financeiro' },
	];

	return (
		<aside className="w-64 bg-white border-r flex-col hidden md:flex flex-shrink-0 overflow-y-auto" style={{ width: '16rem', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '100%' }}>
			<nav className="flex-1 px-4 py-6 space-y-2" style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
				{navItems.map((item) => (
					<div key={item.name}>
						{item.children ? (
							<button
								onClick={() => toggleExpand(item.name)}
								className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${location.pathname.startsWith(item.path)
										? 'bg-blue-50 text-primary'
										: 'text-gray-700 hover:bg-gray-50 hover:text-primary'
									}`}
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									width: '100%',
									gap: '0.75rem',
									padding: '0.5rem 0.75rem',
									fontSize: '0.875rem',
									fontWeight: 500,
									borderRadius: '0.5rem',
									border: 'none',
									background: 'none',
									cursor: 'pointer',
									transition: 'background-color 0.2s, color 0.2s',
									backgroundColor: location.pathname.startsWith(item.path) ? '#eff6ff' : 'transparent',
									color: location.pathname.startsWith(item.path) ? 'var(--primary-color)' : 'var(--text-gray-700)',
								}}
							>
								<div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
									<span className={`material-symbols-outlined ${item.name === 'Cadastros' ? 'fill-1' : ''}`}>
										{item.icon}
									</span>
									{item.name}
								</div>
								<span className="material-symbols-outlined text-gray-400" style={{ fontSize: '1.25rem' }}>
									{expandedItems[item.name] ? 'expand_less' : 'expand_more'}
								</span>
							</button>
						) : (
							<NavLink
								to={item.path}
								className={({ isActive }) =>
									`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
										? 'bg-blue-50 text-primary'
										: 'text-gray-700 hover:bg-gray-50 hover:text-primary'
									}`
								}
								style={({ isActive }) => ({
									display: 'flex',
									alignItems: 'center',
									gap: '0.75rem',
									padding: '0.5rem 0.75rem',
									fontSize: '0.875rem',
									fontWeight: 500,
									borderRadius: '0.5rem',
									textDecoration: 'none',
									transition: 'background-color 0.2s, color 0.2s',
									backgroundColor: isActive ? '#eff6ff' : 'transparent',
									color: isActive ? 'var(--primary-color)' : 'var(--text-gray-700)',
								})}
							>
								<span className="material-symbols-outlined">
									{item.icon}
								</span>
								{item.name}
							</NavLink>
						)}

						{item.children && expandedItems[item.name] && (
							<div className="pl-10 flex flex-col gap-1" style={{ paddingLeft: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
								{item.children.map((child) => (
									<NavLink
										key={child.name}
										to={child.path}
										className={({ isActive }) =>
											`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${isActive
												? 'text-primary bg-primary/5'
												: 'text-gray-600 hover:bg-gray-50 hover:text-primary'
											}`
										}
										style={({ isActive }) => ({
											display: 'flex',
											alignItems: 'center',
											gap: '0.75rem',
											padding: '0.5rem 0.75rem',
											fontSize: '0.75rem',
											fontWeight: 500,
											borderRadius: '0.5rem',
											textDecoration: 'none',
											transition: 'background-color 0.2s, color 0.2s',
											color: isActive ? 'var(--primary-color)' : 'var(--text-gray-600)',
											backgroundColor: isActive ? 'rgba(19, 146, 236, 0.05)' : 'transparent',
										})}
									>
										{child.name}
									</NavLink>
								))}
							</div>
						)}
					</div>
				))}
			</nav>
		</aside>
	);
};

export default Sidebar;
