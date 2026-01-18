import React, { useState, useEffect } from 'react';
import waitingListService from '../../services/waitingListService';

const ListaEspera = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        search: ''
    });

    const [formData, setFormData] = useState({
        name: '',
        city: '',
        phone: '',
        email: '',
        gender_preference: 'any',
        coloration_preference: '',
        breed_preference: '',
        notes: ''
    });

    useEffect(() => {
        loadData();
    }, [filters]);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await waitingListService.getAll(filters);
            setEntries(data);
        } catch (error) {
            console.error('Erro ao carregar lista de espera:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEntry) {
                await waitingListService.update(editingEntry.id, formData);
            } else {
                await waitingListService.create(formData);
            }
            closeModal();
            loadData();
        } catch (error) {
            console.error('Erro ao salvar registro:', error);
            alert('Erro ao salvar registro: ' + error.message);
        }
    };

    const handleEdit = (entry) => {
        setEditingEntry(entry);
        setFormData({
            name: entry.name,
            city: entry.city,
            phone: entry.phone || '',
            email: entry.email || '',
            gender_preference: entry.gender_preference,
            coloration_preference: entry.coloration_preference || '',
            breed_preference: entry.breed_preference || '',
            notes: entry.notes || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este registro?')) {
            try {
                await waitingListService.remove(id);
                loadData();
            } catch (error) {
                console.error('Erro ao deletar:', error);
                alert('Erro ao deletar registro');
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await waitingListService.updateStatus(id, newStatus);
            loadData();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEntry(null);
        setFormData({
            name: '',
            city: '',
            phone: '',
            email: '',
            gender_preference: 'any',
            coloration_preference: '',
            breed_preference: '',
            notes: ''
        });
    };

    const stats = {
        active: entries.filter(e => e.status === 'active').length,
        contacted: entries.filter(e => e.status === 'contacted').length,
        converted: entries.filter(e => e.status === 'converted').length,
        total: entries.length
    };

    const getStatusBadge = (status) => {
        const badges = {
            active: 'badge-green',
            contacted: 'badge-blue',
            converted: 'badge-purple',
            inactive: 'badge-gray'
        };

        const labels = {
            active: 'Ativo',
            contacted: 'Contatado',
            converted: 'Convertido',
            inactive: 'Inativo'
        };

        return (
            <span className={`badge ${badges[status] || 'badge-gray'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const getGenderLabel = (gender) => {
        const labels = {
            male: 'Macho',
            female: 'Fêmea',
            any: 'Tanto faz'
        };
        return labels[gender] || gender;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Lista de Espera</h1>
                    <p className="text-gray-500 mt-1">Gerencie interessados em filhotes futuros.</p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    <span className="material-symbols-outlined">add</span>
                    <span>Adicionar Interessado</span>
                </button>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <span className="material-symbols-outlined text-gray-600 text-4xl">list</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Ativos</p>
                            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                        </div>
                        <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Contatados</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.contacted}</p>
                        </div>
                        <span className="material-symbols-outlined text-blue-600 text-4xl">contact_phone</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Convertidos</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.converted}</p>
                        </div>
                        <span className="material-symbols-outlined text-purple-600 text-4xl">verified</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <option value="active">Ativo</option>
                            <option value="contacted">Contatado</option>
                            <option value="converted">Convertido</option>
                            <option value="inactive">Inativo</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar
                        </label>
                        <input
                            type="text"
                            placeholder="Nome, cidade ou email..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <div className="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Nome</th>
                                <th scope="col">Cidade</th>
                                <th scope="col">Contato</th>
                                <th scope="col">Preferências</th>
                                <th scope="col">Status</th>
                                <th scope="col">Data</th>
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
                            ) : entries.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">
                                        Nenhum registro encontrado
                                    </td>
                                </tr>
                            ) : (
                                entries.map((entry) => (
                                    <tr key={entry.id}>
                                        <td className="font-medium text-gray-900">{entry.name}</td>
                                        <td>{entry.city}</td>
                                        <td>
                                            <div className="text-sm">
                                                {entry.phone && <div>{entry.phone}</div>}
                                                {entry.email && (
                                                    <div className="text-gray-500 text-xs">{entry.email}</div>
                                                )}
                                                {!entry.phone && !entry.email && '-'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-wrap gap-1 text-xs">
                                                <span className="badge badge-gray">
                                                    {getGenderLabel(entry.gender_preference)}
                                                </span>
                                                {entry.breed_preference && (
                                                    <span className="badge badge-blue">{entry.breed_preference}</span>
                                                )}
                                                {entry.coloration_preference && (
                                                    <span className="badge badge-purple">{entry.coloration_preference}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <select
                                                value={entry.status}
                                                onChange={(e) => handleStatusChange(entry.id, e.target.value)}
                                                className="text-xs border border-gray-300 rounded px-2 py-1"
                                            >
                                                <option value="active">Ativo</option>
                                                <option value="contacted">Contatado</option>
                                                <option value="converted">Convertido</option>
                                                <option value="inactive">Inativo</option>
                                            </select>
                                        </td>
                                        <td className="text-sm">
                                            {new Date(entry.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    className="btn-ghost text-sm"
                                                    onClick={() => handleEdit(entry)}
                                                >
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                <button
                                                    className="btn-ghost text-sm text-red-600"
                                                    onClick={() => handleDelete(entry.id)}
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingEntry ? 'Editar Registro' : 'Novo Interessado'}
                                </h2>
                                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nome *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cidade *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Telefone
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Preferência de Sexo *
                                        </label>
                                        <select
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            value={formData.gender_preference}
                                            onChange={(e) => setFormData({ ...formData, gender_preference: e.target.value })}
                                        >
                                            <option value="any">Tanto faz</option>
                                            <option value="male">Macho</option>
                                            <option value="female">Fêmea</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Raça Preferida
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            value={formData.breed_preference}
                                            onChange={(e) => setFormData({ ...formData, breed_preference: e.target.value })}
                                            placeholder="Ex: Labrador"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Coloração Desejada
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            value={formData.coloration_preference}
                                            onChange={(e) => setFormData({ ...formData, coloration_preference: e.target.value })}
                                            placeholder="Ex: Dourado, Preto, Chocolate"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Observações
                                        </label>
                                        <textarea
                                            rows="3"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            placeholder="Informações adicionais..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={closeModal} className="btn-ghost">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        {editingEntry ? 'Atualizar' : 'Adicionar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListaEspera;
