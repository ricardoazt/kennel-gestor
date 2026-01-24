import React, { useState, useEffect } from 'react';
import puppyService from '../services/puppyService';

const ENS_EXERCISES = [
    { id: 'tactile', name: 'Estimulação Tátil', icon: '🖐️', description: 'Cotonete entre os dedos' },
    { id: 'head_up', name: 'Cabeça Erguida', icon: '⬆️', description: 'Vertical para cima' },
    { id: 'head_down', name: 'Cabeça Para Baixo', icon: '⬇️', description: 'Vertical para baixo' },
    { id: 'supine', name: 'Posição Supina', icon: '🔄', description: 'De costas na mão' },
    { id: 'thermal', name: 'Estimulação Térmica', icon: '❄️', description: 'Toalha fria' }
];

const ENSProtocol = ({ puppy, onUpdate }) => {
    const [ensData, setEnsData] = useState(puppy.ens_protocol || {});
    const [saving, setSaving] = useState(false);
    const [currentDay, setCurrentDay] = useState(null);

    useEffect(() => {
        if (puppy.litter?.birth_date) {
            const birth = new Date(puppy.litter.birth_date);
            const today = new Date();
            const diffDays = Math.ceil((today - birth) / (1000 * 60 * 60 * 24));
            setCurrentDay(diffDays);
        }
    }, [puppy.litter?.birth_date]);

    const handleExerciseToggle = async (day, exerciseId) => {
        const dayKey = `day${day}`;
        const newData = {
            ...ensData,
            [dayKey]: {
                ...(ensData[dayKey] || {}),
                [exerciseId]: !ensData[dayKey]?.[exerciseId],
                updated_at: new Date().toISOString()
            }
        };

        setEnsData(newData);

        // Save to backend
        setSaving(true);
        try {
            await puppyService.update(puppy.id, { ens_protocol: newData });
            if (onUpdate) await onUpdate();
        } catch (error) {
            console.error('Error saving ENS data:', error);
            alert('Erro ao salvar dados do protocolo');
            // Revert on error
            setEnsData(ensData);
        } finally {
            setSaving(false);
        }
    };

    const getDayStatus = (day) => {
        const dayKey = `day${day}`;
        const dayData = ensData[dayKey] || {};
        const completedCount = ENS_EXERCISES.filter(ex => dayData[ex.id]).length;

        if (completedCount === 5) return { status: 'complete', label: 'Completo', color: 'bg-green-100 border-green-300' };
        if (completedCount > 0) return { status: 'partial', label: 'Parcial', color: 'bg-yellow-100 border-yellow-300' };
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
    const isENSComplete = progress.completeDays === 14;

    if (!puppy.litter?.birth_date) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <span className="material-symbols-outlined text-yellow-600 text-5xl mb-2">info</span>
                <p className="text-yellow-800 font-medium">
                    Data de nascimento não disponível
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                    O protocolo ENS requer a data de nascimento da ninhada
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header & Progress */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="material-symbols-outlined text-purple-600">psychology</span>
                            Protocolo Super Dogs (ENS)
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Estimulação Neurológica Precoce • Dias 3 a 16 de vida
                        </p>
                    </div>
                    {isENSComplete && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full border border-green-300">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            <span className="font-semibold text-sm">Completo!</span>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Progresso: {progress.completeDays}/14 dias completos
                        </span>
                        <span className="text-sm font-semibold text-purple-600">
                            {progress.percentage.toFixed(0)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500"
                            style={{ width: `${progress.percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Sobre o Protocolo
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                    Cada exercício deve ser realizado por <strong>3-5 segundos</strong>, uma vez por dia.
                </p>
                <p className="text-sm text-blue-700">
                    ✅ Benefícios: Melhor desempenho cardiovascular, maior resistência a doenças,
                    tolerância ao estresse e facilidade de aprendizado.
                </p>
            </div>

            {/* Exercise Grid */}
            <div className="space-y-3">
                {Array.from({ length: 14 }, (_, i) => i + 3).map(day => {
                    const dayKey = `day${day}`;
                    const dayData = ensData[dayKey] || {};
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
                                        dayStatus.status === 'partial' ? 'bg-yellow-200 text-yellow-800' :
                                            'bg-gray-200 text-gray-600'
                                    }`}>
                                    {dayStatus.label}
                                </span>
                            </div>

                            {/* Exercise Checkboxes */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                                {ENS_EXERCISES.map(exercise => (
                                    <button
                                        key={exercise.id}
                                        onClick={() => isDayAvailable && handleExerciseToggle(day, exercise.id)}
                                        disabled={!isDayAvailable || saving}
                                        className={`p-3 rounded-lg border-2 transition-all text-left ${dayData[exercise.id]
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-300 bg-white hover:border-gray-400'
                                            } ${!isDayAvailable ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        title={exercise.description}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{exercise.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-xs font-medium text-gray-700 truncate">
                                                        {exercise.name}
                                                    </span>
                                                    <span className={`material-symbols-outlined text-sm ${dayData[exercise.id] ? 'text-green-600' : 'text-gray-300'
                                                        }`}>
                                                        {dayData[exercise.id] ? 'check_circle' : 'radio_button_unchecked'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">Legenda dos Exercícios</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {ENS_EXERCISES.map(exercise => (
                        <div key={exercise.id} className="flex items-start gap-2">
                            <span className="text-xl">{exercise.icon}</span>
                            <div>
                                <p className="text-sm font-medium text-gray-800">{exercise.name}</p>
                                <p className="text-xs text-gray-600">{exercise.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ENSProtocol;
