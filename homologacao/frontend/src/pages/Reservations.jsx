import React, { useState, useEffect } from 'react';
import {
	getReservations,
	getLitters,
	updateReservationStatus,
	getExpiringReservations
} from '../services/reservationService';

const Dashboard = () => {
	const [reservations, setReservations] = useState([]);
	const [litters, setLitters] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		status: '',
		litter_id: '',
		search: ''
	});
	const [expiringReservations, setExpiringReservations] = useState([]);

	// Load data
	useEffect(() => {
		loadData();
	}, [filters]);

	const loadData = async () => {
		try {
			setLoading(true);
			const [reservationsData, littersData, expiringData] = await Promise.all([
				getReservations(filters),
				getLitters(),
				getExpiringReservations(24)
			]);
			setReservations(reservationsData);
			setLitters(littersData);
			setExpiringReservations(expiringData);
		} catch (error) {
			console.error('Erro ao carregar dados:', error);
		} finally {
			setLoading(false);
		}
	};

	// Calculate stats
	const stats = {
		awaiting_deposit: reservations.filter(r => r.status === 'awaiting_deposit').length,
		confirmed: reservations.filter(r => r.status === 'confirmed').length,
		contract_pending: reservations.filter(r => r.status === 'contract_pending').length,
		active: reservations.filter(r => r.status === 'active').length,
		expiring: expiringReservations.length
	};

	// Get urgency level based on expires_at
	const getUrgencyClass = (expiresAt, status) => {
		if (status !== 'awaiting_deposit' || !expiresAt) return '';

		const now = new Date();
		const expiry = new Date(expiresAt);
		const hoursRemaining = (expiry - now) / (1000 * 60 * 60);

		if (hoursRemaining < 0) return 'border-red-500';
		if (hoursRemaining <= 6) return 'border-red-400';
		if (hoursRemaining <= 12) return 'border-orange-400';
		if (hoursRemaining <= 24) return 'border-yellow-400';
		return '';
	};

	// Status badge colors
	const getStatusBadge = (status) => {
		const badges = {
			awaiting_deposit: 'badge-yellow',
			confirmed: 'badge-green',
			contract_pending: 'badge-blue',
			active: 'badge-purple',
			completed: 'badge-gray',
			cancelled: 'badge-red',
			expired: 'badge-red'
		};

		const labels = {
			awaiting_deposit: 'Aguardando Sinal',
			confirmed: 'Confirmada',
			contract_pending: 'Contrato Pendente',
			active: 'Ativa',
			completed: 'Entregue',
			cancelled: 'Cancelada',
			expired: 'Expirada'
		};

		return (
			<span className={`badge ${badges[status] || 'badge-gray'}`}>
				{labels[status] || status}
			</span>
		);
	};

	// Format currency
	const formatCurrency = (value) => {
		if (!value) return '-';
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(value);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Cadastro de Reservas</h1>
					<p className="text-gray-500 mt-1">Gerencie reservas com compromisso financeiro.</p>
				</div>
				<button className="btn-primary">
					<span className="material-symbols-outlined">add</span>
					<span>Nova Reserva</span>
				</button>
			</div>

			{/* Stats Dashboard */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Aguardando Sinal</p>
							<p className="text-2xl font-bold text-yellow-600">{stats.awaiting_deposit}</p>
						</div>
						<span className="material-symbols-outlined text-yellow-600 text-4xl">schedule</span>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Confirmadas</p>
							<p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
						</div>
						<span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Contrato Pendente</p>
							<p className="text-2xl font-bold text-blue-600">{stats.contract_pending}</p>
						</div>
						<span className="material-symbols-outlined text-blue-600 text-4xl">description</span>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Ativas</p>
							<p className="text-2xl font-bold text-purple-600">{stats.active}</p>
						</div>
						<span className="material-symbols-outlined text-purple-600 text-4xl">verified</span>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">Expirando Hoje</p>
							<p className="text-2xl font-bold text-red-600">{stats.expiring}</p>
						</div>
						<span className="material-symbols-outlined text-red-600 text-4xl">warning</span>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-lg shadow p-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Status
						</label>
						<select
							className="w-full border border-gray-300 rounded-lg px-3 py-2"
							value={filters.status}
							onChange={(e) => setFilters({ ...filters, status: e.target.value })}
						>
							<option value="">Todos</option>
							<option value="awaiting_deposit">Aguardando Sinal</option>
							<option value="confirmed">Confirmada</option>
							<option value="contract_pending">Contrato Pendente</option>
							<option value="active">Ativa</option>
							<option value="completed">Entregue</option>
							<option value="cancelled">Cancelada</option>
							<option value="expired">Expirada</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Ninhada
						</label>
						<select
							className="w-full border border-gray-300 rounded-lg px-3 py-2"
							value={filters.litter_id}
							onChange={(e) => setFilters({ ...filters, litter_id: e.target.value })}
						>
							<option value="">Todas as ninhadas</option>
							{litters.map(litter => (
								<option key={litter.id} value={litter.id}>
									{litter.name || `Ninhada #${litter.id}`}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Buscar Cliente
						</label>
						<input
							type="text"
							placeholder="Nome, email ou telefone..."
							className="w-full border border-gray-300 rounded-lg px-3 py-2"
							value={filters.search}
							onChange={(e) => setFilters({ ...filters, search: e.target.value })}
						/>
					</div>
				</div>
			</div>

			{/* Reservations Table */}
			<div className="table-container">
				<div className="overflow-x-auto">
					<table>
						<thead>
							<tr>
								<th scope="col">Cliente</th>
								<th scope="col">Objeto</th>
								<th scope="col">Preferências</th>
								<th scope="col">Valores</th>
								<th scope="col">Status</th>
								<th scope="col">Data / Expiração</th>
								<th scope="col"><span className="sr-only">Ações</span></th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td colSpan="7" className="text-center py-8">
										<span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
									</td>
								</tr>
							) : reservations.length === 0 ? (
								<tr>
									<td colSpan="7" className="text-center py-8 text-gray-500">
										Nenhuma reserva encontrada
									</td>
								</tr>
							) : (
								reservations.map((reservation) => {
									const urgencyClass = getUrgencyClass(reservation.expires_at, reservation.status);
									return (
										<tr
											key={reservation.id}
											className={urgencyClass ? `border-l-4 ${urgencyClass}` : ''}
										>
											<td className="font-medium text-gray-900">
												{reservation.client?.name || 'Cliente não encontrado'}
												<br />
												<span className="text-xs text-gray-500">{reservation.client?.email}</span>
											</td>
											<td>
												{reservation.reservation_type === 'litter_choice' ? (
													<>
														{reservation.litter?.name || `Ninhada #${reservation.litter_id}`}
														<br />
														<span className="text-xs text-gray-500">
															{reservation.choice_priority || `Escolha ${reservation.choice_gender === 'male' ? 'Macho' : 'Fêmea'}`}
														</span>
													</>
												) : (
													<>
														Filhote Específico
														<br />
														<span className="text-xs text-gray-500">ID: {reservation.puppy_id}</span>
													</>
												)}
											</td>
											<td>
												{reservation.preferences ? (
													<div className="flex gap-2 text-xs">
														{reservation.preferences.preferred_gender !== 'no_preference' && (
															<span className="badge badge-gray">
																{reservation.preferences.preferred_gender === 'male' ? 'Macho' : 'Fêmea'}
															</span>
														)}
														{reservation.preferences.temperament_preference !== 'no_preference' && (
															<span className="badge badge-blue">
																{reservation.preferences.temperament_preference}
															</span>
														)}
													</div>
												) : '-'}
											</td>
											<td>
												<div>
													<span className="font-medium">{formatCurrency(reservation.total_value)}</span>
													<br />
													<span className="text-xs text-gray-500">
														Sinal: {formatCurrency(reservation.deposit_value)}
														{reservation.deposit_paid && ' ✓'}
													</span>
												</div>
											</td>
											<td>
												{getStatusBadge(reservation.status)}
											</td>
											<td>
												<div className="text-sm">
													<div>
														{new Date(reservation.createdAt).toLocaleDateString('pt-BR')}
													</div>
													{reservation.expires_at && reservation.status === 'awaiting_deposit' && (
														<div className="text-xs text-red-600">
															Expira: {new Date(reservation.expires_at).toLocaleString('pt-BR')}
														</div>
													)}
												</div>
											</td>
											<td className="text-right">
												<div className="flex items-center justify-end gap-2">
													<button className="btn-ghost text-sm">
														Ver Detalhes
													</button>
												</div>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
