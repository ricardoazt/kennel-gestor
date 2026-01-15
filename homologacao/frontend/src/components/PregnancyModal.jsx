import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pregnancyService from '../services/pregnancyService';

const PregnancyModal = ({ pregnancy, onClose, onUpdate, onDelete }) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        observations: pregnancy.observations || '',
        medical_notes: pregnancy.medical_notes || '',
        status: pregnancy.status
    });
    const [loading, setLoading] = useState(false);

    const daysPregnant = pregnancyService.calculateDaysPregnant(pregnancy.breeding_date);
    const progress = pregnancyService.calculateProgress(pregnancy.breeding_date);

    const handleSave = async () => {
        try {
            setLoading(true);
            await pregnancyService.update(pregnancy.id, formData);
            onUpdate();
        } catch (error) {
            console.error('Error updating pregnancy:', error);
            alert('Erro ao atualizar gestação');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja deletar esta gestação?')) return;

        try {
            setLoading(true);
            await pregnancyService.delete(pregnancy.id);
            onDelete();
        } catch (error) {
            console.error('Error deleting pregnancy:', error);
            alert('Erro ao deletar gestação');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmBirth = async () => {
        if (!confirm('Confirmar o nascimento desta ninhada? Você será direcionado para registrar os filhotes.')) return;

        try {
            setLoading(true);
            // Update pregnancy status to born first
            const birthDate = new Date().toISOString().split('T')[0];
            await pregnancyService.updateStatus(pregnancy.id, 'born', birthDate);

            // Navigate to litter creation with pregnancy data
            navigate('/ninhadas/nova', {
                state: {
                    pregnancyId: pregnancy.id,
                    fatherId: pregnancy.father_id,
                    motherId: pregnancy.mother_id,
                    birthDate: birthDate,
                    fatherName: pregnancy.Father?.nome,
                    motherName: pregnancy.Mother?.nome
                }
            });
        } catch (error) {
            console.error('Error confirming birth:', error);
            alert('Erro ao confirmar nascimento');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-t-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Detalhes da Gestação</h2>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">female</span>
                                    <span>{pregnancy.Mother?.nome}</span>
                                </div>
                                <span>×</span>
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">male</span>
                                    <span>{pregnancy.Father?.nome}</span>
                                </div>
                            </div>
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
                <div className="p-6 space-y-6">
                    {/* Progress section */}
                    {pregnancy.status === 'pregnant' && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-semibold text-gray-700">Progresso da Gestação</span>
                                <span className="text-lg font-bold text-blue-600">{Math.min(daysPregnant, 63)}/63 dias</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Cruza: {new Date(pregnancy.breeding_date).toLocaleDateString('pt-BR')}</span>
                                <span>Previsão: {new Date(pregnancy.expected_birth_date).toLocaleDateString('pt-BR')}</span>
                            </div>
                        </div>
                    )}

                    {/* Confirm Birth Button */}
                    <div>
                        <button
                            onClick={handleConfirmBirth}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                        >
                            <span className="material-symbols-outlined text-2xl">celebration</span>
                            <span className="text-lg">Confirmar Nascimento</span>
                        </button>
                        <p className="mt-2 text-sm text-gray-500 text-center">
                            Ao confirmar, você será direcionado para registrar a ninhada e os filhotes
                        </p>
                    </div>

                    {/* Observations */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <span className="material-symbols-outlined text-base align-middle mr-1">notes</span>
                            Observações Gerais
                        </label>
                        <textarea
                            value={formData.observations}
                            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                            placeholder="Anote observações sobre comportamento, apetite, etc..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="4"
                        />
                    </div>

                    {/* Medical notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <span className="material-symbols-outlined text-base align-middle mr-1">medical_information</span>
                            Anotações Médicas/Veterinárias
                        </label>
                        <textarea
                            value={formData.medical_notes}
                            onChange={(e) => setFormData({ ...formData, medical_notes: e.target.value })}
                            placeholder="Registre consultas veterinárias, medicações, ultrassons, etc..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="4"
                        />
                    </div>

                    {/* Additional info cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-blue-500">thermostat</span>
                                <span className="font-semibold text-gray-700">Temperatura</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Monitore a temperatura corporal da mãe. Uma queda significativa pode indicar que o parto está próximo.
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-purple-500">ecg_heart</span>
                                <span className="font-semibold text-gray-700">Ultrassom</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Ultrassons ajudam a confirmar a gestação e estimar o número de filhotes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-xl flex justify-between items-center border-t">
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="text-red-500 hover:text-red-600 font-medium flex items-center gap-1 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">delete</span>
                        Deletar
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="btn-primary disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PregnancyModal;
