import React, { useState, useEffect } from 'react';
import animalService from '../services/animalService';
import pregnancyService from '../services/pregnancyService';

const CreatePregnancyModal = ({ onClose, onSuccess }) => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        mother_id: '',
        father_id: '',
        breeding_date: new Date().toISOString().split('T')[0],
        observations: ''
    });

    useEffect(() => {
        loadAnimals();
    }, []);

    const loadAnimals = async () => {
        try {
            setLoading(true);
            const data = await animalService.getActive();
            setAnimals(data);
        } catch (error) {
            console.error('Error loading animals:', error);
            alert('Erro ao carregar animais');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.mother_id || !formData.father_id) {
            alert('Por favor, selecione a mãe e o pai');
            return;
        }

        if (formData.mother_id === formData.father_id) {
            alert('A mãe e o pai devem ser diferentes');
            return;
        }

        try {
            setSubmitting(true);
            await pregnancyService.create({
                mother_id: parseInt(formData.mother_id),
                father_id: parseInt(formData.father_id),
                breeding_date: formData.breeding_date,
                observations: formData.observations
            });
            onSuccess();
        } catch (error) {
            console.error('Error creating pregnancy:', error);
            alert(error.response?.data?.error || 'Erro ao criar gestação');
        } finally {
            setSubmitting(false);
        }
    };

    // Filter animals by sex
    const females = animals.filter(a => a.sexo === 'Femea');
    const males = animals.filter(a => a.sexo === 'Macho');

    const getAnimalPhoto = (animal) => {
        return animal?.photos?.[0] || null;
    };

    const AnimalOption = ({ animal }) => {
        const photo = getAnimalPhoto(animal);
        return (
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {photo ? (
                        <img
                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${photo}`}
                            alt={animal.nome}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-400">pets</span>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="font-medium text-gray-900">{animal.nome}</div>
                    {animal.registro && (
                        <div className="text-xs text-gray-500">{animal.registro}</div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-t-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Nova Gestação</h2>
                            <p className="text-blue-100 text-sm">Registre uma nova gestação no plantel</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Carregando animais do plantel...</p>
                        </div>
                    ) : (
                        <>
                            {/* Mother selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <span className="material-symbols-outlined text-base align-middle mr-1 text-pink-500">female</span>
                                    Mãe *
                                </label>
                                <select
                                    value={formData.mother_id}
                                    onChange={(e) => setFormData({ ...formData, mother_id: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Selecione a mãe</option>
                                    {females.length === 0 ? (
                                        <option disabled>Nenhuma fêmea cadastrada</option>
                                    ) : (
                                        females.map(animal => (
                                            <option key={animal.id} value={animal.id}>
                                                {animal.nome} {animal.registro ? `(${animal.registro})` : ''}
                                            </option>
                                        ))
                                    )}
                                </select>
                                {females.length === 0 && (
                                    <p className="mt-1 text-sm text-amber-600 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">warning</span>
                                        Nenhuma fêmea cadastrada no plantel
                                    </p>
                                )}
                            </div>

                            {/* Father selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <span className="material-symbols-outlined text-base align-middle mr-1 text-blue-500">male</span>
                                    Pai *
                                </label>
                                <select
                                    value={formData.father_id}
                                    onChange={(e) => setFormData({ ...formData, father_id: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Selecione o pai</option>
                                    {males.length === 0 ? (
                                        <option disabled>Nenhum macho cadastrado</option>
                                    ) : (
                                        males.map(animal => (
                                            <option key={animal.id} value={animal.id}>
                                                {animal.nome} {animal.registro ? `(${animal.registro})` : ''}
                                            </option>
                                        ))
                                    )}
                                </select>
                                {males.length === 0 && (
                                    <p className="mt-1 text-sm text-amber-600 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">warning</span>
                                        Nenhum macho cadastrado no plantel
                                    </p>
                                )}
                            </div>

                            {/* Breeding date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <span className="material-symbols-outlined text-base align-middle mr-1">event</span>
                                    Data da Última Cruza *
                                </label>
                                <input
                                    type="date"
                                    value={formData.breeding_date}
                                    onChange={(e) => setFormData({ ...formData, breeding_date: e.target.value })}
                                    required
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    A partir desta data, a gestação terá duração estimada de 63 dias
                                </p>
                            </div>

                            {/* Observations */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <span className="material-symbols-outlined text-base align-middle mr-1">notes</span>
                                    Observações Iniciais
                                </label>
                                <textarea
                                    value={formData.observations}
                                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                                    placeholder="Anote observações sobre a cruza, comportamento, etc..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                />
                            </div>

                            {/* Info box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-blue-500 flex-shrink-0">info</span>
                                    <div className="text-sm text-blue-800">
                                        <p className="font-semibold mb-1">Sobre a Gestação Canina</p>
                                        <p>A gestação em cadelas tem duração média de 63 dias (aproximadamente 9 semanas). O sistema calculará automaticamente a data prevista do parto e acompanhará o progresso diariamente.</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </form>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end gap-3 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={submitting || loading || females.length === 0 || males.length === 0}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Criando...' : 'Criar Gestação'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePregnancyModal;
