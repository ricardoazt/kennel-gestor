import React from 'react';

const Dashboard = () => {
	return (
		<div className="space-y-8">
			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
				{[
					{ title: 'Total de Cães', value: '78', change: '+2%', color: 'blue', icon: 'pets' },
					{ title: 'Ninhadas Ativas', value: '5', change: '+1', color: 'purple', icon: 'bedroom_baby' },
					{ title: 'Filhotes Atuais', value: '32', change: '+5%', color: 'emerald', icon: 'child_friendly' },
					{ title: 'Reservados', value: '12', change: '-2%', color: 'amber', icon: 'bookmark_added' },
					{ title: 'Disponíveis', value: '20', change: '+10%', color: 'indigo', icon: 'check_circle' },
				].map((stat, index) => (
					<div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4" style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
						<div className={`flex size-12 items-center justify-center rounded-lg bg-${stat.color}-50 text-${stat.color}-600`} style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', backgroundColor: `var(--${stat.color}-50, #eff6ff)`, color: `var(--${stat.color}-600, #2563eb)` }}>
							<span className="material-symbols-outlined">{stat.icon}</span>
						</div>
						<div>
							<p className="text-sm font-medium text-gray-500" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-gray-500)' }}>{stat.title}</p>
							<div className="flex items-baseline gap-2" style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
								<h3 className="text-2xl font-bold text-gray-900" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-gray-900)' }}>{stat.value}</h3>
								<span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded" style={{ fontSize: '0.75rem', fontWeight: 500, color: '#166534', backgroundColor: '#dcfce7', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>{stat.change}</span>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
				{/* Agenda */}
				<div className="lg:col-span-7 flex flex-col gap-8" style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
						<div className="p-6 border-b border-gray-100 flex justify-between items-center" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<h3 className="text-lg font-bold text-gray-900 flex items-center gap-2" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-gray-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
								<span className="material-symbols-outlined text-primary" style={{ color: 'var(--primary-color)' }}>calendar_month</span>
								Agenda Geral do Canil
							</h3>
							<a href="#" className="text-sm font-medium text-primary" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-color)', textDecoration: 'none' }}>Ver tudo</a>
						</div>
						<div className="divide-y divide-gray-100">
							{[
								{ title: 'Cruza: Fifi & Rex', sub: 'Próximo evento agendado', date: '25 Out', time: '09:00', icon: 'favorite', color: 'pink' },
								{ title: 'Vacina V10: Filhote #3', sub: 'Consulta agendada', date: '28 Out', time: '14:30', icon: 'vaccines', color: 'blue' },
							].map((item, i) => (
								<div key={i} className="flex items-center p-4 hover:bg-gray-50 transition-colors" style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
									<div className="flex-shrink-0 mr-4">
										<div className={`size-10 rounded-full bg-${item.color}-100 text-${item.color}-600 flex items-center justify-center`} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: '#fce7f3', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
											<span className="material-symbols-outlined text-xl">{item.icon}</span>
										</div>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
										<p className="text-xs text-gray-500 truncate">{item.sub}</p>
									</div>
									<div className="text-right">
										<p className="text-sm font-medium text-gray-900">{item.date}</p>
										<p className="text-xs text-gray-500">{item.time}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Location Map Placeholder */}
				<div className="lg:col-span-5 flex flex-col h-full" style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', height: '100%' }}>
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full" style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid var(--border-color)', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-lg font-bold text-gray-900">Localização de Clientes</h3>
							<span className="material-symbols-outlined text-gray-400">more_vert</span>
						</div>
						<div className="flex-1 bg-background-light rounded-lg flex items-center justify-center overflow-hidden min-h-[350px] relative" style={{ flex: 1, backgroundColor: 'var(--background-light)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px', position: 'relative' }}>
							<p className="text-gray-500">Mapa Placeholder</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
