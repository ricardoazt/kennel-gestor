import React, { useState, useEffect } from 'react';
import pregnancyService from '../../services/pregnancyService';
import animalService from '../../services/animalService';
import PregnancyCard from '../../components/PregnancyCard';
import PregnancyModal from '../../components/PregnancyModal';
import CreatePregnancyModal from '../../components/CreatePregnancyModal';

const Gestacao = () => {
    const [pregnancies, setPregnancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPregnancy, setSelectedPregnancy] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        loadPregnancies();
    }, []);

    const loadPregnancies = async () => {
        try {
            setLoading(true);
            // Always show only pregnant status
            const data = await pregnancyService.getAll('pregnant');
            setPregnancies(data);
        } catch (error) {
            console.error('Error loading pregnancies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (pregnancy) => {
        setSelectedPregnancy(pregnancy);
        setShowDetailsModal(true);
    };

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        loadPregnancies();
    };

    const handleUpdateSuccess = () => {
        setShowDetailsModal(false);
        loadPregnancies();
    };

    const handleDeleteSuccess = () => {
        setShowDetailsModal(false);
        loadPregnancies();
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-gray-900 text-2xl font-bold">Gestação e Pré-parto</h1>
                    <p className="text-gray-600">Acompanhamento de gestações e cuidados pré-parto.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    Nova Gestação
                </button>
            </div>

            {/* Pregnancies grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">Carregando gestações...</p>
                    </div>
                ) : pregnancies.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">pregnant_woman</span>
                        <p className="text-gray-500">Nenhuma gestação encontrada</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
                        >
                            Criar primeira gestação
                        </button>
                    </div>
                ) : (
                    pregnancies.map(pregnancy => (
                        <PregnancyCard
                            key={pregnancy.id}
                            pregnancy={pregnancy}
                            onClick={() => handleCardClick(pregnancy)}
                        />
                    ))
                )}
            </div>

            {/* Modals */}
            {showDetailsModal && selectedPregnancy && (
                <PregnancyModal
                    pregnancy={selectedPregnancy}
                    onClose={() => setShowDetailsModal(false)}
                    onUpdate={handleUpdateSuccess}
                    onDelete={handleDeleteSuccess}
                />
            )}

            {showCreateModal && (
                <CreatePregnancyModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}
        </div>
    );
};

export default Gestacao;
