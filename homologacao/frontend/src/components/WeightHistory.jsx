import React, { useState } from 'react';

const WeightHistory = ({ puppyId, weightHistory = [], onAddWeight }) => {
    const [showModal, setShowModal] = useState(false);
    const [newWeight, setNewWeight] = useState({ weight: '', date: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onAddWeight(newWeight.weight, newWeight.date);
            setNewWeight({ weight: '', date: '' });
            setShowModal(false);
        } catch (error) {
            alert('Erro ao adicionar pesagem');
        } finally {
            setLoading(false);
        }
    };

    // Sort by date descending (most recent first)
    const sortedHistory = [...weightHistory].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Histórico de Pesagem</h3>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary text-sm px-4 py-2"
                >
                    <span className="material-symbols-outlined text-sm mr-1">add</span>
                    Adicionar Pesagem
                </button>
            </div>

            {sortedHistory.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <span className="material-symbols-outlined text-gray-400 text-5xl mb-2">
                        scale
                    </span>
                    <p className="text-gray-500">Nenhuma pesagem registrada ainda</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Peso</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Idade Aprox.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedHistory.map((entry, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-900">
                                        {new Date(entry.date).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="font-semibold text-blue-600">
                                            {parseFloat(entry.weight).toFixed(0)}g
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600 text-sm">
                                        {entry.recorded_at && new Date(entry.recorded_at).toLocaleDateString('pt-BR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Weight Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">Adicionar Pesagem</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Data da Pesagem
                                </label>
                                <input
                                    type="date"
                                    value={newWeight.date}
                                    onChange={(e) => setNewWeight({ ...newWeight, date: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Peso (gramas)
                                </label>
                                <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={newWeight.weight}
                                    onChange={(e) => setNewWeight({ ...newWeight, weight: e.target.value })}
                                    placeholder="Ex: 450"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 btn-primary"
                                >
                                    {loading ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeightHistory;
