import React, { useState, useEffect } from 'react';
import puppyService from '../services/puppyService';

const ESI_SCENTS = [
    { id: 'grass', name: 'Grama', icon: '🌿' },
    { id: 'leather', name: 'Couro', icon: '👜' },
    { id: 'suede', name: 'Camurça', icon: '🧥' },
    { id: 'wood', name: 'Madeira', icon: '🌳' },
    { id: 'citrus', name: 'Cítrico', icon: '🍋' },
    { id: 'herbs', name: 'Ervas', icon: '🌿' },
    { id: 'vanilla', name: 'Baunilha', icon: '🍦' },
    { id: 'lavender', name: 'Lavanda', icon: '💜' },
    { id: 'mint', name: 'Menta', icon: '🌱' },
    { id: 'coffee', name: 'Café', icon: '☕' },
];

const ESIProtocol = ({ puppy, onUpdate }) => {
    const [esiData, setEsiData] = useState(puppy.esi_protocol || {});
    const [saving, setSaving] = useState(false);
    const [currentDay, setCurrentDay] = useState(null);
    const [executor] = useState('Maria'); // Could be made dynamic with a selector

    useEffect(() => {
        if (puppy.litter?.birth_date) {
            const birth = new Date(puppy.litter.birth_date);
            const today = new Date();
            const diffDays = Math.ceil((today - birth) / (1000 * 60 * 60 * 24));
            setCurrentDay(diffDays);
        }
    }, [puppy.litter?.birth_date]);

    const handleScentChange = async (day, scent, executor) => {
        const dayKey = `day${day}`;
        const newData = {
            ...esiData,
            [dayKey]: {
                scent: scent,
                executor: executor,
                timestamp: new Date().toISOString()
            }
        };

        setEsiData(newData);

        // Save to backend
        setSaving(true);
        try {
            await puppyService.update(puppy.id, { esi_protocol: newData });
            if (onUpdate) await onUpdate();
        } catch (error) {
            console.error('Error saving ESI data:', error);
            alert('Erro ao salvar dados do protocolo');
            setEsiData(esiData);
        } finally {
            setSaving(false);
        }
    };

    const getDayStatus = (day) => {
        const dayKey = `day${day}`;
        const dayData = esiData[dayKey];

        if (dayData && dayData.scent) {
            return { status: 'complete', label: 'Completo', color: 'bg-green-100 border-green-300' };
        }
        return { status: 'pending', label: 'Pendente', color: 'bg-gray-100 border-gray-300' };
    };

    const calculateProgress = () => {
        let completeDays = 0;
        for (let day = 3; day <= 16; day++) {
            const dayStatus = getDayStatus(day);
            if (dayStatus.status === 'complete') completeDays++;
        }
        return { completeDays, totalDays: 14, percentage: (completeDays / 14) * 100 };
    };

    const progress = calculateProgress();
    const isESIComplete = progress.completeDays === 14;

    if (!puppy.litter?.birth_date) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <span className="material-symbols-outlined text-yellow-600 text-5xl mb-2">info</span>
                <p className="text-yellow-800 font-medium">
                    Data de nascimento não disponível
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                    O protocolo ESI requer a data de nascimento da ninhada
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Progress Bar */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                        Progresso: {progress.completeDays}/14 dias completos
                    </span>
                    <span className="text-sm font-semibold text-indigo-600">
                        {progress.percentage.toFixed(0)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
                        style={{ width: `${progress.percentage}%` }}
                    />
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Sobre o Protocolo ESI
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                    Apresente um novo odor por dia, durante <strong>3-5 segundos</strong>.
                </p>
                <p className="text-sm text-blue-700">
                    ✅ Benefícios: Aumenta capacidade olfativa, confiança, e reduz medos futuros.
                </p>
            </div>

            {/* Day-by-day tracking */}
            <div className="space-y-3">
                {Array.from({ length: 14 }, (_, i) => i + 3).map(day => {
                    const dayKey = `day${day}`;
                    const dayData = esiData[dayKey] || {};
                    const dayStatus = getDayStatus(day);
                    const isDayAvailable = currentDay >= day;
                    const isToday = currentDay === day;

                    return (
                        <div
                            key={day}
                            className={`rounded-lg border p-4 transition-all ${isToday ? 'border-blue-400 bg-blue-50' :
                                    !isDayAvailable ? 'border-gray-200 bg-gray-50 opacity-60' :
                                        dayStatus.color
                                }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className={`font-bold text-lg ${isToday ? 'text-blue-600' :
                                            !isDayAvailable ? 'text-gray-400' :
                                                dayStatus.status === 'complete' ? 'text-green-700' :
                                                    'text-gray-700'
                                        }`}>
                                        Dia {day}
                                    </span>
                                    {isToday && (
                                        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                                            Hoje
                                        </span>
                                    )}
                                </div>
                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${dayStatus.status === 'complete' ? 'bg-green-200 text-green-800' :
                                        'bg-gray-200 text-gray-600'
                                    }`}>
                                    {dayStatus.label}
                                </span>
                            </div>

                            {/* Scent Input */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Odor Apresentado
                                    </label>
                                    <input
                                        type="text"
                                        value={dayData.scent || ''}
                                        onChange={(e) => isDayAvailable && handleScentChange(day, e.target.value, executor)}
                                        disabled={!isDayAvailable || saving}
                                        placeholder="Digite ou selecione..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm disabled:bg-gray-100"
                                        list={`scents-${day}`}
                                    />
                                    <datalist id={`scents-${day}`}>
                                        {ESI_SCENTS.map(scent => (
                                            <option key={scent.id} value={scent.name} />
                                        ))}
                                    </datalist>
                                </div>

                                {dayData.scent && (
                                    <div className="text-xs text-gray-600 flex flex-col justify-center">
                                        <p>
                                            <span className="font-medium">Executor:</span> {dayData.executor}
                                        </p>
                                        <p>
                                            <span className="font-medium">Data:</span>{' '}
                                            {new Date(dayData.timestamp).toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Reference */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">Odores Sugeridos</h4>
                <div className="flex flex-wrap gap-2">
                    {ESI_SCENTS.map(scent => (
                        <span
                            key={scent.id}
                            className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700"
                        >
                            {scent.icon} {scent.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ESIProtocol;
