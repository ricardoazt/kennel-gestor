import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import litterService from '../../services/litterService';

const LitterList = () => {
    const navigate = useNavigate();
    const [litters, setLitters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [litterToDelete, setLitterToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadLitters();
    }, []);

    const loadLitters = async () => {
        try {
            setLoading(true);
            const data = await litterService.getAll();
            setLitters(data);
        } catch (error) {
            console.error('Error loading litters:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (litterId) => {
        navigate(`/ninhadas/${litterId}`);
    };

    const calculateAge = (birthDate) => {
        const days = litterService.calculatePuppyAge(birthDate);
        if (days === 0) return 'Nascido hoje';
        if (days === 1) return '1 dia';
        return `${days} dias`;
    };

    const handleDeleteClick = (e, litter) => {
        e.stopPropagation(); // Prevent card click
        setLitterToDelete(litter);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!litterToDelete) return;

        try {
            setDeleting(true);
            await litterService.delete(litterToDelete.id);
            setShowDeleteModal(false);
            setLitterToDelete(null);
            // Refresh litters list
            await loadLitters();
        } catch (error) {
            console.error('Error deleting litter:', error);
            const errorMessage = error.response?.data?.error || 'Erro ao excluir ninhada. Por favor, tente novamente.';
            alert(errorMessage);
        } finally {
            setDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setLitterToDelete(null);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-gray-900 text-2xl font-bold">Ninhadas</h1>
                    <p className="text-gray-600">Gerencie as ninhadas e filhotes</p>
                </div>
                <button
                    onClick={() => navigate('/ninhadas/nova')}
                    className="btn-primary flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    Nova Ninhada
                </button>
            </div>

            {/* Litters grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">Carregando ninhadas...</p>
                    </div>
                ) : litters.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">pets</span>
                        <p className="text-gray-500 mb-4">Nenhuma ninhada cadastrada</p>
                        <button
                            onClick={() => navigate('/ninhadas/nova')}
                            className="text-blue-500 hover:text-blue-600 font-medium"
                        >
                            Criar primeira ninhada
                        </button>
                    </div>
                ) : (
                    litters.map(litter => {
                        const totalPuppies = (litter.total_males || 0) + (litter.total_females || 0);
                        const age = calculateAge(litter.birth_date);
                        const motherPhoto = litter.Mother?.photos?.[0] || null;
                        const fatherPhoto = litter.Father?.photos?.[0] || null;

                        return (
                            <div
                                key={litter.id}
                                onClick={() => handleCardClick(litter.id)}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-100 hover:border-blue-300"
                            >
                                {/* Header */}
                                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-lg">
                                                {litter.name || `Ninhada #${litter.id}`}
                                            </h3>
                                            <p className="text-sm text-gray-600">{age}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                {totalPuppies} filhote{totalPuppies !== 1 ? 's' : ''}
                                            </span>
                                            <button
                                                onClick={(e) => handleDeleteClick(e, litter)}
                                                className="p-2 rounded-lg hover:bg-red-100 transition-colors group"
                                                title="Excluir ninhada"
                                            >
                                                <span className="material-symbols-outlined text-gray-400 group-hover:text-red-600 text-xl">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Parent photos */}
                                    <div className="flex gap-2">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                                            {motherPhoto ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${motherPhoto}`}
                                                    alt={litter.Mother?.nome}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-gray-400 text-3xl">pets</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                                            {fatherPhoto ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${fatherPhoto}`}
                                                    alt={litter.Father?.nome}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-gray-400 text-3xl">pets</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Parent info */}
                                <div className="p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-pink-500 text-lg">female</span>
                                        <span className="text-gray-700">{litter.Mother?.nome}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="material-symbols-outlined text-blue-500 text-lg">male</span>
                                        <span className="text-gray-700">{litter.Father?.nome}</span>
                                    </div>

                                    {/* Puppy count breakdown */}
                                    <div className="pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-600">
                                        <span>♂ {litter.total_males || 0} macho{litter.total_males !== 1 ? 's' : ''}</span>
                                        <span>♀ {litter.total_females || 0} fêmea{litter.total_females !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && litterToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-red-600 text-2xl">warning</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Excluir Ninhada</h3>
                                    <p className="text-sm text-gray-600">Esta ação não pode ser desfeita</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                                <p className="font-semibold text-gray-900 mb-2">
                                    {litterToDelete.name || `Ninhada #${litterToDelete.id}`}
                                </p>
                                <div className="text-sm text-gray-700 space-y-1">
                                    <p>
                                        <span className="material-symbols-outlined text-pink-500 text-base align-middle mr-1">female</span>
                                        Mãe: {litterToDelete.Mother?.nome}
                                    </p>
                                    <p>
                                        <span className="material-symbols-outlined text-blue-500 text-base align-middle mr-1">male</span>
                                        Pai: {litterToDelete.Father?.nome}
                                    </p>
                                    <p className="font-medium mt-2">
                                        Total: {(litterToDelete.total_males || 0) + (litterToDelete.total_females || 0)} filhote(s)
                                    </p>
                                </div>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-800">
                                    <strong>Atenção:</strong> Ao excluir esta ninhada, todos os filhotes e informações associadas também serão removidos permanentemente.
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                            <button
                                onClick={handleCancelDelete}
                                disabled={deleting}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {deleting ? (
                                    <>
                                        <span className="animate-spin material-symbols-outlined text-base">refresh</span>
                                        Excluindo...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-base">delete</span>
                                        Confirmar Exclusão
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LitterList;
