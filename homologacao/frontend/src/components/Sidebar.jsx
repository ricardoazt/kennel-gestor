import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ isCollapsed = false, onToggle }) => {
	const location = useLocation();
	const [expandedItems, setExpandedItems] = useState({
		'Comercial': true
	});

	const toggleExpand = (name) => {
		if (!isCollapsed) {
			setExpandedItems(prev => ({
				...prev,
				[name]: !prev[name]
			}));
		}
	};

	const navItems = [
		{ name: 'Dashboard', icon: 'dashboard', path: '/' },
		{
			name: 'Comercial',
			icon: 'handshake',
			path: '/comercial',
			children: [
				{ name: 'Funil de Vendas', path: '/crm/funil-vendas' },
				{ name: 'Reservas', path: '/cadastros/reservas' },
				{ name: 'Clientes', path: '/cadastros/clientes', disabled: true, tag: 'Em breve' },
				{ name: 'Contratos', path: '/comercial/contratos' }
			]
		},
		{
			name: 'Plantel',
			icon: 'pets',
			path: '/plantel',
			children: [
				{ name: 'Todos os Cães', path: '/plantel' },
				{ name: 'Pedigrees', path: '/pedigree-studio' }
			]
		},
		{
			name: 'Reprodução',
			icon: 'science',
			path: '/reproducao',
			children: [
				{ name: 'Calendário de Cios', path: '/reproducao/calendario-cios' },
				{ name: 'Planejador de Cruzas', path: '/reproducao/planejador-cruzas' },
				{ name: 'Gestação', path: '/reproducao/gestacao' }
			]
		},
		{ name: 'Ninhadas', icon: 'grid_view', path: '/ninhadas' },
		{
			name: 'Saúde',
			icon: 'health_and_safety',
			path: '/saude',
			children: [
				{ name: 'Protocolos Padrão', path: '/saude/protocolos' },
				{ name: 'Agenda Sanitária', path: '/saude/agenda' },
				{ name: 'Histórico Clínico', path: '/saude/historico' }
			]
		},
		{
			name: 'Financeiro',
			icon: 'payments',
			path: '/financeiro',
			children: [
				{ name: 'Fluxo de Caixa', path: '/financeiro/fluxo-caixa' },
				{ name: 'Análise por Cão', path: '/financeiro/analise-cao' },
				{ name: 'Estoque', path: '/financeiro/estoque' },
				{ name: 'Compras', path: '/financeiro/compras' }
			]
		},
		{
			name: 'Loja e Mídias',
			icon: 'storefront',
			path: '/loja',
			children: [
				{ name: 'Catálogo', path: '/loja/catalogo' },
				{ name: 'Pedidos', path: '/loja/pedidos' },
				{ name: 'Galeria de Mídias', path: '/media-center/gallery' }
			]
		},
		{
			name: 'Configurações',
			icon: 'settings',
			path: '/configuracoes',
			children: [
				{ name: 'Usuários', path: '/configuracoes/usuarios' },
				{ name: 'Modelos', path: '/configuracoes/modelos' },
				{ name: 'Integrações', path: '/configuracoes/integracoes' }
			]
		}
	];

	return (
		<aside
			className="bg-white border-r flex-col hidden md:flex flex-shrink-0 overflow-y-auto transition-all duration-300"
			style={{
				width: isCollapsed ? '5rem' : '16rem',
				borderRight: '1px solid var(--border-color)',
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				transition: 'width 300ms ease-in-out'
			}}
		>
			{/* Toggle Button */}
			<div className="p-4 border-b border-slate-200 flex items-center justify-center">
				<button
					onClick={onToggle}
					className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
					title={isCollapsed ? 'Expandir menu' : 'Retrair menu'}
				>
					<span className="material-symbols-outlined">
						{isCollapsed ? 'menu' : 'menu_open'}
					</span>
				</button>
			</div>

			<nav className="flex-1 px-4 py-6 space-y-2" style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
				{navItems.map((item) => (
					<div key={item.name}>
						{item.children ? (
							<>
								<button
									onClick={() => toggleExpand(item.name)}
									className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${location.pathname.startsWith(item.path)
										? 'bg-blue-50 text-primary'
										: 'text-gray-700 hover:bg-gray-50 hover:text-primary'
										}`}
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: isCollapsed ? 'center' : 'space-between',
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
									title={isCollapsed ? item.name : ''}
								>
									<div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
										<span className={`material-symbols-outlined ${item.name === 'CRM' ? 'fill-1' : ''}`}>
											{item.icon}
										</span>
										{!isCollapsed && item.name}
									</div>
									{!isCollapsed && (
										<span className="material-symbols-outlined text-gray-400" style={{ fontSize: '1.25rem' }}>
											{expandedItems[item.name] ? 'expand_less' : 'expand_more'}
										</span>
									)}
								</button>
								{/* Children only show when expanded and sidebar is not collapsed */}
								{item.children && expandedItems[item.name] && !isCollapsed && (
									<div className="pl-10 flex flex-col gap-1" style={{ paddingLeft: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
										{item.children.map((child) => (
											child.disabled ? (
												<div
													key={child.name}
													className="flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg text-gray-400 cursor-not-allowed opacity-75"
													style={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'space-between',
														padding: '0.5rem 0.75rem',
														fontSize: '0.75rem',
														fontWeight: 500,
														borderRadius: '0.5rem',
														color: '#9ca3af',
														cursor: 'not-allowed',
														opacity: 0.75,
													}}
												>
													<span className="flex items-center gap-3">
														{child.name}
													</span>
													{child.tag && (
														<span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
															{child.tag}
														</span>
													)}
												</div>
											) : (
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
											)
										))}
									</div>
								)}
							</>
						) : (
							<NavLink
								to={item.path}
								className={({ isActive }) =>
									`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
										? 'bg-blue-50 text-primary'
										: 'text-gray-700 hover:bg-gray-50 hover:text-primary'
									}`
								}
								style={({ isActive }) => ({
									display: 'flex',
									alignItems: 'center',
									justifyContent: isCollapsed ? 'center' : 'flex-start',
									gap: isCollapsed ? '0' : '0.75rem',
									padding: '0.5rem 0.75rem',
									fontSize: '0.875rem',
									fontWeight: 500,
									borderRadius: '0.5rem',
									textDecoration: 'none',
									transition: 'background-color 0.2s, color 0.2s',
									backgroundColor: isActive ? '#eff6ff' : 'transparent',
									color: isActive ? 'var(--primary-color)' : 'var(--text-gray-700)',
								})}
								title={isCollapsed ? item.name : ''}
							>
								<span className="material-symbols-outlined">
									{item.icon}
								</span>
								{!isCollapsed && item.name}
							</NavLink>
						)}
					</div>
				))}
			</nav>
		</aside>
	);
};

export default Sidebar;
