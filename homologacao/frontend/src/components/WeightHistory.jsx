import React, { useState, useEffect } from 'react';

const WeightHistory = ({
    puppyId,
    weightHistory = [],
    onAddWeight,
    isEditing,
    onDeleteWeight,
    birthWeight = null,
    birthDate = null
}) => {
    const [showModal, setShowModal] = useState(false);
    const [newWeight, setNewWeight] = useState({ weight: '', date: '' });
    const [loading, setLoading] = useState(false);

    // Auto-fill today's date when modal opens
    useEffect(() => {
        if (showModal) {
            const today = new Date().toISOString().split('T')[0];
            setNewWeight({ weight: '', date: today });
        }
    }, [showModal]);

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

    // Calculate percentage gain between weights
    const calculateGain = (current, previous) => {
        if (!previous || previous === 0) return null;
        return ((current - previous) / previous) * 100;
    };

    // Get status based on gain percentage
    const getGainStatus = (gainPercent) => {
        if (gainPercent === null) {
            return {
                color: 'bg-gray-100 text-gray-700 border-gray-200',
                label: '-',
                icon: '',
                textColor: 'text-gray-600'
            };
        }

        if (gainPercent < 0) {
            return {
                color: 'bg-red-100 text-red-800 border-red-300',
                label: 'Crítico',
                icon: 'warning',
                textColor: 'text-red-700',
                alert: true
            };
        }

        if (gainPercent < 2) {
            return {
                color: 'bg-orange-100 text-orange-800 border-orange-300',
                label: 'Atenção',
                icon: 'error_outline',
                textColor: 'text-orange-700'
            };
        }

        if (gainPercent < 5) {
            return {
                color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                label: 'Normal',
                icon: 'info',
                textColor: 'text-yellow-700'
            };
        }

        return {
            color: 'bg-green-100 text-green-800 border-green-300',
            label: 'Ótimo',
            icon: 'check_circle',
            textColor: 'text-green-700'
        };
    };

    // Calculate days since birth
    const calculateDayOfLife = (weightDate) => {
        if (!birthDate || !weightDate) return null;
        const birth = new Date(birthDate);
        const weight = new Date(weightDate);
        const diffTime = Math.abs(weight - birth);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Check if weight has doubled by day 10
    const checkDoublingRule = (currentWeight, dayOfLife) => {
        if (!birthWeight || !dayOfLife || dayOfLife < 10) return null;

        const hasDoubled = currentWeight >= (birthWeight * 2);

        if (dayOfLife === 10) {
            return {
                achieved: hasDoubled,
                message: hasDoubled
                    ? '🎉 Dobrou o peso no 10º dia!'
                    : '⚠️ Não atingiu o dobro no 10º dia'
            };
        }

        if (dayOfLife > 10 && !hasDoubled) {
            return {
                achieved: false,
                message: `⚠️ Ainda não dobrou (dia ${dayOfLife})`
            };
        }

        if (hasDoubled) {
            return {
                achieved: true,
                message: `✅ Dobrou no dia ${dayOfLife}`
            };
        }

        return null;
    };

    // Sort by date ascending and process with gain calculations
    const processedHistory = [...weightHistory]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((entry, index, array) => {
            const previousEntry = index > 0 ? array[index - 1] : null;
            const previousWeight = previousEntry ? parseFloat(previousEntry.weight) : (index === 0 ? birthWeight : null);
            const currentWeight = parseFloat(entry.weight);
            const gainPercent = calculateGain(currentWeight, previousWeight);
            const dayOfLife = calculateDayOfLife(entry.date);
            const doublingCheck = checkDoublingRule(currentWeight, dayOfLife);

            return {
                ...entry,
                gainPercent,
                status: getGainStatus(gainPercent),
                dayOfLife,
                doublingCheck
            };
        })
        .reverse(); // Show most recent first

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

            {processedHistory.length === 0 ? (
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
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Ganho %</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                {birthDate && (
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Dia</th>
                                )}
                                {isEditing && (
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Ações</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {processedHistory.map((entry, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-900">
                                        {entry.date ? new Date(entry.date).toLocaleDateString('pt-BR') : '-'}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="font-semibold text-blue-600">
                                            {parseFloat(entry.weight).toFixed(0)}g
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {entry.gainPercent !== null ? (
                                            <span className={`font-semibold ${entry.status.textColor}`}>
                                                {entry.gainPercent >= 0 ? '+' : ''}{entry.gainPercent.toFixed(1)}%
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {entry.status.icon && (
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${entry.status.color}`}>
                                                    <span className="material-symbols-outlined text-sm">{entry.status.icon}</span>
                                                    {entry.status.label}
                                                </span>
                                                {entry.status.alert && (
                                                    <span className="material-symbols-outlined text-red-500 animate-pulse" title="Alerta crítico!">
                                                        notifications_active
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    {birthDate && (
                                        <td className="py-3 px-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-gray-700 text-sm font-medium">
                                                    Dia {entry.dayOfLife}
                                                </span>
                                                {entry.doublingCheck && (
                                                    <span className={`text-xs ${entry.doublingCheck.achieved ? 'text-green-600' : 'text-orange-600'}`}>
                                                        {entry.doublingCheck.message}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                    {isEditing && (
                                        <td className="py-3 px-4 text-right">
                                            <button
                                                onClick={() => onDeleteWeight(entry)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                                title="Excluir pesagem"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </td>
                                    )}
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
