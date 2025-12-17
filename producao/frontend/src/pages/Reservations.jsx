import React from 'react';

const Dashboard = () => {
	const reservations = [
		{
			name: 'Carlos Almeida',
			detail: 'Ninhada Golden Retriever #2',
			value: 'R$ 1.500,00',
			date: '22/10/2024',
			status: 'Sinal Recebido',
			statusClass: 'badge-green',
		},
		{
			name: 'Juliana Ribeiro',
			detail: 'Ninhada Bulldog Francês #5',
			value: 'R$ 2.000,00',
			date: '-',
			status: 'Aguardando Sinal',
			statusClass: 'badge-yellow',
		},
		{
			name: 'Fernando Costa',
			detail: 'ID Filhote: KGL-24-003',
			value: 'R$ 1.800,00',
			date: '15/10/2024',
			status: 'Em Contrato',
			statusClass: 'badge-blue',
		},
		{
			name: 'Mariana Gonçalves',
			detail: 'Ninhada Golden Retriever #2',
			value: 'R$ 1.500,00',
			date: '-',
			status: 'Aguardando Sinal',
			statusClass: 'badge-yellow',
		},
		{
			name: 'Lucas Martins',
			detail: 'ID Filhote: KGL-24-007',
			value: 'R$ 1.750,00',
			date: '20/10/2024',
			status: 'Sinal Recebido',
			statusClass: 'badge-green',
		},
	];

	return (
		<div>
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<div>
					<h1 className="text-gray-900 text-2xl font-bold leading-tight" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-gray-900)' }}>Cadastro de Reservas</h1>
					<p className="text-gray-600 text-base font-normal" style={{ color: 'var(--text-gray-600)' }}>Gerencie reservas com compromisso financeiro.</p>
				</div>
				<div className="flex items-center gap-2">
					<button className="btn-primary">
						<span className="material-symbols-outlined">add</span>
						<span>Nova Reserva</span>
					</button>
				</div>
			</div>

			<div className="table-container">
				<div className="overflow-x-auto">
					<table>
						<thead>
							<tr>
								<th scope="col">Interessado</th>
								<th scope="col">Ninhada / Filhote</th>
								<th scope="col">Valor da Reserva</th>
								<th scope="col">Data do Pagamento</th>
								<th scope="col">Status</th>
								<th scope="col"><span className="sr-only">Ações</span></th>
							</tr>
						</thead>
						<tbody>
							{reservations.map((res, index) => (
								<tr key={index}>
									<td className="font-medium text-gray-900 whitespace-nowrap" style={{ fontWeight: 500, color: 'var(--text-gray-900)' }}>{res.name}</td>
									<td>{res.detail}</td>
									<td>{res.value}</td>
									<td>{res.date}</td>
									<td>
										<span className={`badge ${res.statusClass}`}>
											{res.status}
										</span>
									</td>
									<td className="text-right" style={{ textAlign: 'right' }}>
										<div className="flex items-center justify-end gap-2" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
											{res.status === 'Sinal Recebido' && (
												<button className="btn-ghost">
													<span className="material-symbols-outlined text-base" style={{ fontSize: '1rem' }}>description</span>
													Gerar Contrato
												</button>
											)}
											<button className="btn-ghost">
												<span className="material-symbols-outlined text-base" style={{ fontSize: '1rem' }}>person_add</span>
												Mover para Cliente Efetivo
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
