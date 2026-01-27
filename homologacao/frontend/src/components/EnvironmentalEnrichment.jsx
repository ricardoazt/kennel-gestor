import React, { useState, useEffect } from 'react';
import puppyService from '../services/puppyService';

const ENRICHMENT_ITEMS = [
    { id: 'grass', name: 'Grama', icon: '🌿', description: 'Superfície natural macia' },
    { id: 'gravel', name: 'Brita', icon: '🪨', description: 'Pedras pequenas' },
    { id: 'smooth_floor', name: 'Piso Liso', icon: '🏠', description: 'Cerâmica ou porcelanato' },
    { id: 'wood', name: 'Madeira', icon: '🌳', description: 'Deck ou assoalho' },
    { id: 'sand', name: 'Areia', icon: '🏖️', description: 'Textura granular fina' },
    { id: 'water', name: 'Água Rasa', icon: '🌊', description: 'Piscina infantil rasa' },
    { id: 'tunnel', name: 'Túnel', icon: '🚇', description: 'Espaço confinado' },
    { id: 'balance', name: 'Prancha de Equilíbrio', icon: '⚖️', description: 'Superfície instável' },
    { id: 'ramp', name: 'Rampa', icon: '📐', description: 'Inclinação suave' },
    { id: 'obstacles', name: 'Obstáculos Baixos', icon: '🎪', description: 'Pequenos desafios' },
];

const EnvironmentalEnrichment = ({ puppy, onUpdate }) => {
    const [enrichmentData, setEnrichmentData] = useState(puppy.environmental_enrichment || {});
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

    const handleItemToggle = async (itemId, executor) => {
        const isCurrentlyComplete = enrichmentData[itemId]?.completed;

        const newData = {
            ...enrichmentData,
            [itemId]: isCurrentlyComplete
                ? { completed: false }
                : {
                    completed: true,
                    date: new Date().toISOString().split('T')[0],
                    executor: executor,
                    timestamp: new Date().toISOString()
                }
        };

        setEnrichmentData(newData);

        // Save to backend
        setSaving(true);
        try {
            await puppyService.update(puppy.id, { environmental_enrichment: newData });
            if (onUpdate) await onUpdate();
        } catch (error) {
            console.error('Error saving environmental enrichment data:', error);
            alert('Erro ao salvar dados do protocolo');
            setEnrichmentData(enrichmentData);
        } finally {
            setSaving(false);
        }
    };

    const calculateProgress = () => {
        const completedCount = ENRICHMENT_ITEMS.filter(item => enrichmentData[item.id]?.completed).length;
        return {
            completed: completedCount,
            total: ENRICHMENT_ITEMS.length,
            percentage: (completedCount / ENRICHMENT_ITEMS.length) * 100
        };
    };

    const progress = calculateProgress();
    const isComplete = progress.completed === progress.total;
    const isProtocolActive = currentDay >= 25 && currentDay <= 60;

    if (!puppy.litter?.birth_date) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <span className="material-symbols-outlined text-yellow-600 text-5xl mb-2">info</span>
                <p className="text-yellow-800 font-medium">
                    Data de nascimento não disponível
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                    O enriquecimento ambiental requer a data de nascimento da ninhada
                </p>
            </div>
        );
    }

    if (currentDay < 25) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <span className="material-symbols-outlined text-blue-600 text-5xl mb-2">schedule</span>
                <p className="text-blue-800 font-medium">
                    Protocolo ainda não disponível
                </p>
                <p className="text-blue-700 text-sm mt-1">
                    O enriquecimento ambiental começa no <strong>dia 25</strong> de vida
                </p>
                <p className="text-blue-600 text-sm mt-2">
                    Faltam {25 - currentDay} dias
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
                        Progresso: {progress.completed}/{progress.total} superfícies apresentadas
                    </span>
                    <span className="text-sm font-semibold text-teal-600">
                        {progress.percentage.toFixed(0)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-teal-500 to-green-500 h-full transition-all duration-500"
                        style={{ width: `${progress.percentage}%` }}
                    />
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Sobre o Enriquecimento Ambiental
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                    Período: <strong>Dias 25 a 60</strong> de vida. Exponha o filhote a diferentes texturas e superfícies.
                </p>
                <p className="text-sm text-blue-700">
                    ✅ Benefícios: Propriocepção, confiança, coragem e adaptabilidade.
                </p>
            </div>

            {/* Enrichment Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ENRICHMENT_ITEMS.map(item => {
                    const itemInfo = enrichmentData[item.id] || {};
                    const isChecked = itemInfo.completed || false;

                    return (
                        <button
                            key={item.id}
                            onClick={() => isProtocolActive && handleItemToggle(item.id, executor)}
                            disabled={!isProtocolActive || saving}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${isChecked
                                    ? 'border-teal-500 bg-teal-50'
                                    : 'border-gray-300 bg-white hover:border-gray-400'
                                } ${!isProtocolActive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-3xl">{item.icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                        <span className={`material-symbols-outlined ${isChecked ? 'text-teal-600' : 'text-gray-300'
                                            }`}>
                                            {isChecked ? 'check_circle' : 'radio_button_unchecked'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2">{item.description}</p>

                                    {isChecked && itemInfo.executor && (
                                        <div className="text-xs text-gray-700 bg-white p-2 rounded border border-teal-200 mt-2">
                                            <p>
                                                <span className="font-medium">Executor:</span> {itemInfo.executor}
                                            </p>
                                            <p>
                                                <span className="font-medium">Data:</span>{' '}
                                                {new Date(itemInfo.date).toLocaleDateString('pt-BR')}
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
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-center">
                    <span className="material-symbols-outlined text-teal-600 text-4xl mb-2">verified</span>
                    <p className="text-teal-800 font-semibold">
                        Enriquecimento Ambiental Completo!
                    </p>
                    <p className="text-teal-700 text-sm mt-1">
                        Este filhote foi exposto a todas as superfícies essenciais.
                    </p>
                </div>
            )}
        </div>
    );
};

export default EnvironmentalEnrichment;
