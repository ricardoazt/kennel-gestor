import React, { useState, useEffect } from 'react';
import puppyService from '../services/puppyService';

const SOUND_ITEMS = [
    { id: 'thunder', name: 'Trovão', icon: '⛈️', description: 'Sons de tempestade' },
    { id: 'fireworks', name: 'Fogos de Artifício', icon: '🎆', description: 'Explosões e estalos' },
    { id: 'traffic', name: 'Trânsito', icon: '🚗', description: 'Carros e buzinas' },
    { id: 'children', name: 'Crianças Gritando', icon: '👶', description: 'Vozes infantis altas' },
    { id: 'vacuum', name: 'Aspirador de Pó', icon: '🧹', description: 'Equipamentos domésticos' },
    { id: 'tv', name: 'TV em Volume Alto', icon: '📺', description: 'Televisão e rádio' },
    { id: 'doorbell', name: 'Campainha', icon: '🔔', description: 'Toque de porta' },
    { id: 'kitchen', name: 'Utensílios de Cozinha', icon: '🍳', description: 'Panelas e talheres' },
];

const SoundDesensitization = ({ puppy, onUpdate }) => {
    const [soundData, setSoundData] = useState(puppy.sound_desensitization || {});
    const [saving, setSaving] = useState(false);
    const [currentDay, setCurrentDay] = useState(null);
    const [executor] = useState('Maria'); // Could be made dynamic

    useEffect(() => {
        if (puppy.litter?.birth_date) {
            const birth = new Date(puppy.litter.birth_date);
            const today = new Date();
            const diffDays = Math.ceil((today - birth) / (1000 * 60 * 60 * 24));
            setCurrentDay(diffDays);
        }
    }, [puppy.litter?.birth_date]);

    const handleSoundToggle = async (soundId, executor) => {
        const isCurrentlyComplete = soundData[soundId]?.completed;

        const newData = {
            ...soundData,
            [soundId]: isCurrentlyComplete
                ? { completed: false }
                : {
                    completed: true,
                    date: new Date().toISOString().split('T')[0],
                    executor: executor,
                    timestamp: new Date().toISOString()
                }
        };

        setSoundData(newData);

        // Save to backend
        setSaving(true);
        try {
            await puppyService.update(puppy.id, { sound_desensitization: newData });
            if (onUpdate) await onUpdate();
        } catch (error) {
            console.error('Error saving sound desensitization data:', error);
            alert('Erro ao salvar dados do protocolo');
            setSoundData(soundData);
        } finally {
            setSaving(false);
        }
    };

    const calculateProgress = () => {
        const completedCount = SOUND_ITEMS.filter(item => soundData[item.id]?.completed).length;
        return {
            completed: completedCount,
            total: SOUND_ITEMS.length,
            percentage: (completedCount / SOUND_ITEMS.length) * 100
        };
    };

    const progress = calculateProgress();
    const isComplete = progress.completed === progress.total;
    const isProtocolActive = currentDay >= 21 && currentDay <= 60;

    if (!puppy.litter?.birth_date) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <span className="material-symbols-outlined text-yellow-600 text-5xl mb-2">info</span>
                <p className="text-yellow-800 font-medium">
                    Data de nascimento não disponível
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                    A dessensibilização sonora requer a data de nascimento da ninhada
                </p>
            </div>
        );
    }

    if (currentDay < 21) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <span className="material-symbols-outlined text-blue-600 text-5xl mb-2">schedule</span>
                <p className="text-blue-800 font-medium">
                    Protocolo ainda não disponível
                </p>
                <p className="text-blue-700 text-sm mt-1">
                    A dessensibilização sonora começa no <strong>dia 21</strong> de vida
                </p>
                <p className="text-blue-600 text-sm mt-2">
                    Faltam {21 - currentDay} dias
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
                        Progresso: {progress.completed}/{progress.total} sons apresentados
                    </span>
                    <span className="text-sm font-semibold text-orange-600">
                        {progress.percentage.toFixed(0)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-500"
                        style={{ width: `${progress.percentage}%` }}
                    />
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Sobre a Dessensibilização Sonora
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                    Período: <strong>Dias 21 a 60</strong> de vida. Exponha o filhote gradualmente a cada som.
                </p>
                <p className="text-sm text-blue-700">
                    ✅ Benefícios: Estabilidade emocional, confiança, redução de fobias sonoras.
                </p>
            </div>

            {/* Sound Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SOUND_ITEMS.map(sound => {
                    const soundInfo = soundData[sound.id] || {};
                    const isChecked = soundInfo.completed || false;

                    return (
                        <button
                            key={sound.id}
                            onClick={() => isProtocolActive && handleSoundToggle(sound.id, executor)}
                            disabled={!isProtocolActive || saving}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${isChecked
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-300 bg-white hover:border-gray-400'
                                } ${!isProtocolActive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-3xl">{sound.icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-gray-900">{sound.name}</h4>
                                        <span className={`material-symbols-outlined ${isChecked ? 'text-green-600' : 'text-gray-300'
                                            }`}>
                                            {isChecked ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2">{sound.description}</p>

                                    {isChecked && soundInfo.executor && (
                                        <div className="text-xs text-gray-700 bg-white p-2 rounded border border-green-200 mt-2">
                                            <p>
                                                <span className="font-medium">Executor:</span> {soundInfo.executor}
                                            </p>
                                            <p>
                                                <span className="font-medium">Data:</span>{' '}
                                                {new Date(soundInfo.date).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {isComplete && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <span className="material-symbols-outlined text-green-600 text-4xl mb-2">verified</span>
                    <p className="text-green-800 font-semibold">
                        Dessensibilização Sonora Completa!
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                        Este filhote foi exposto a todos os sons essenciais.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SoundDesensitization;
