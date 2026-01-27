import React, { useState, useEffect } from 'react';
import breedService from '../../services/breedService';

const Breeds = () => {
    const [breeds, setBreeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActive, setFilterActive] = useState('all'); // 'all', 'active', 'inactive'
    const [showModal, setShowModal] = useState(false);
    const [editingBreed, setEditingBreed] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', active: true });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [breedToDelete, setBreedToDelete] = useState(null);

    useEffect(() => {
        loadBreeds();
    }, []);

    const loadBreeds = async () => {
        try {
            setLoading(true);
            const data = await breedService.getAll();
            setBreeds(data);
        } catch (error) {
            console.error('Error loading breeds:', error);
            alert('Erro ao carregar raças');
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setEditingBreed(null);
        setFormData({ name: '', description: '', active: true });
        setShowModal(true);
    };

    const handleEditClick = (breed) => {
        setEditingBreed(breed);
        setFormData({
            name: breed.name,
            description: breed.description || '',
            active: breed.active
        });
        setShowModal(true);
    };

    const handleDeleteClick = (breed) => {
        setBreedToDelete(breed);
        setShowDeleteModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingBreed) {
                await breedService.update(editingBreed.id, formData);
            } else {
                await breedService.create(formData);
            }

            setShowModal(false);
            loadBreeds();
        } catch (error) {
            console.error('Error saving breed:', error);
            const errorMsg = error.response?.data?.error || 'Erro ao salvar raça';
            alert(errorMsg);
        }
    };

    const handleToggleActive = async (breed) => {
        try {
            await breedService.toggleActive(breed.id);
            loadBreeds();
        } catch (error) {
            console.error('Error toggling breed:', error);
            alert('Erro ao alterar status da raça');
        }
    };

    const handleConfirmDelete = async () => {
        if (!breedToDelete) return;

        try {
            await breedService.delete(breedToDelete.id);
            setShowDeleteModal(false);
            setBreedToDelete(null);
            loadBreeds();
        } catch (error) {
            console.error('Error deleting breed:', error);
            const errorMsg = error.response?.data?.error || 'Erro ao excluir raça';
            alert(errorMsg);
        }
    };

    // Filter and search breeds
    const filteredBreeds = breeds.filter(breed => {
        const matchesSearch = breed.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filterActive === 'all' ? true :
                filterActive === 'active' ? breed.active :
                    !breed.active;

        return matchesSearch && matchesFilter;
    });

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-gray-900 text-2xl font-bold">Raças</h1>
                    <p className="text-gray-600">Gerencie as raças do canil</p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="btn-primary flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    Nova Raça
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar raça..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterActive('all')}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${filterActive === 'all'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Todas
                        </button>
                        <button
                            onClick={() => setFilterActive('active')}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${filterActive === 'active'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Ativas
                        </button>
                        <button
                            onClick={() => setFilterActive('inactive')}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${filterActive === 'inactive'
                                    ? 'bg-gray-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Inativas
                        </button>
                    </div>
                </div>
            </div>

            {/* Breeds Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Carregando raças...</p>
                </div>
            ) : filteredBreeds.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">pets</span>
                    <p className="text-gray-500 mb-4">
                        {searchTerm ? 'Nenhuma raça encontrada' : 'Nenhuma raça cadastrada'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={handleAddClick}
                            className="text-blue-500 hover:text-blue-600 font-medium"
                        >
                            Cadastrar primeira raça
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBreeds.map(breed => (
                        <div
                            key={breed.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">{breed.name}</h3>
                                    {breed.description && (
                                        <p className="text-sm text-gray-600">{breed.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleToggleActive(breed)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${breed.active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    {breed.active ? '✓ Ativa' : 'Inativa'}
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                <span className="material-symbols-outlined text-lg">pets</span>
                                <span>{breed.animal_count || 0} animais</span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditClick(breed)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(breed)}
                                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingBreed ? 'Editar Raça' : 'Nova Raça'}
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome da Raça *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Golden Retriever"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descrição
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Informações sobre a raça (opcional)"
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="active" className="text-sm font-medium text-gray-700">
                                    Raça ativa (apta para reprodução)
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {editingBreed ? 'Salvar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && breedToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-red-600">warning</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Excluir Raça</h3>
                                    <p className="text-sm text-gray-600">Esta ação não pode ser desfeita</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-700 mb-4">
                                Tem certeza que deseja excluir a raça <strong>{breedToDelete.name}</strong>?
                            </p>
                            {breedToDelete.animal_count > 0 && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-amber-800">
                                        <strong>Atenção:</strong> Existem {breedToDelete.animal_count} animais cadastrados com esta raça.
                                        A exclusão pode não ser permitida.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Confirmar Exclusão
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Breeds;
