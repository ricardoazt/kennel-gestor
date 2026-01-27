import React, { useState } from 'react';
import ENSProtocol from './ENSProtocol';
import ESIProtocol from './ESIProtocol';
import SoundDesensitization from './SoundDesensitization';
import EnvironmentalEnrichment from './EnvironmentalEnrichment';

const PROTOCOL_TABS = [
    {
        id: 'ens',
        name: 'Neurológico',
        icon: '🧠',
        materialIcon: 'psychology',
        description: 'Protocolo Super Dogs (ENS)',
        period: 'Dias 3-16'
    },
    {
        id: 'esi',
        name: 'Olfativo',
        icon: '👃',
        materialIcon: 'local_florist',
        description: 'Early Scent Introduction (ESI)',
        period: 'Dias 3-16'
    },
    {
        id: 'sound',
        name: 'Auditivo',
        icon: '🔊',
        materialIcon: 'volume_up',
        description: 'Dessensibilização Sonora',
        period: 'Dias 21-60'
    },
    {
        id: 'environmental',
        name: 'Sensorial',
        icon: '🏃',
        materialIcon: 'terrain',
        description: 'Enriquecimento Ambiental',
        period: 'Dias 25-60'
    },
];

const BiostimulationProtocols = ({ puppy, onUpdate }) => {
    const [activeProtocol, setActiveProtocol] = useState('ens');

    // Calculate overall completion status
    const calculateOverallProgress = () => {
        let totalProtocols = 4;
        let completedProtocols = 0;

        // ENS - check if 14 days are complete
        const ensData = puppy.ens_protocol || {};
        let ensComplete = true;
        for (let day = 3; day <= 16; day++) {
            const dayKey = `day${day}`;
            const dayData = ensData[dayKey] || {};
            const exerciseCount = Object.values(dayData).filter(v => v === true).length;
            if (exerciseCount < 5) {
                ensComplete = false;
                break;
            }
        }
        if (ensComplete) completedProtocols++;

        // ESI - check if 14 days have scents
        const esiData = puppy.esi_protocol || {};
        let esiDaysComplete = 0;
        for (let day = 3; day <= 16; day++) {
            const dayKey = `day${day}`;
            if (esiData[dayKey]?.scent) esiDaysComplete++;
        }
        if (esiDaysComplete === 14) completedProtocols++;

        // Sound - check if all 8 sounds are done
        const soundData = puppy.sound_desensitization || {};
        const soundItems = ['thunder', 'fireworks', 'traffic', 'children', 'vacuum', 'tv', 'doorbell', 'kitchen'];
        const soundComplete = soundItems.filter(id => soundData[id]?.completed).length;
        if (soundComplete === 8) completedProtocols++;

        // Environmental - check if all 10 items are done
        const envData = puppy.environmental_enrichment || {};
        const envItems = ['grass', 'gravel', 'smooth_floor', 'wood', 'sand', 'water', 'tunnel', 'balance', 'ramp', 'obstacles'];
        const envComplete = envItems.filter(id => envData[id]?.completed).length;
        if (envComplete === 10) completedProtocols++;

        return {
            completed: completedProtocols,
            total: totalProtocols,
            percentage: (completedProtocols / totalProtocols) * 100
        };
    };

    const overallProgress = calculateOverallProgress();
    const isFullyComplete = overallProgress.completed === overallProgress.total;

    const renderProtocolContent = () => {
        switch (activeProtocol) {
            case 'ens':
                return <ENSProtocol puppy={puppy} onUpdate={onUpdate} />;
            case 'esi':
                return <ESIProtocol puppy={puppy} onUpdate={onUpdate} />;
            case 'sound':
                return <SoundDesensitization puppy={puppy} onUpdate={onUpdate} />;
            case 'environmental':
                return <EnvironmentalEnrichment puppy={puppy} onUpdate={onUpdate} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Overall Progress */}
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="material-symbols-outlined text-purple-600 text-3xl">neurology</span>
                            Bioestímulo
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Programa Completo de Estimulação Neurológica e Sensorial
                        </p>
                    </div>
                    {isFullyComplete && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full border border-green-300">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            <span className="font-semibold text-sm">100% Completo!</span>
                        </div>
                    )}
                </div>

                {/* Overall Progress Bar */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Progresso Geral: {overallProgress.completed}/{overallProgress.total} protocolos completos
                        </span>
                        <span className="text-sm font-semibold text-purple-600">
                            {overallProgress.percentage.toFixed(0)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 h-full transition-all duration-500"
                            style={{ width: `${overallProgress.percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Protocol Navigation */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PROTOCOL_TABS.map(protocol => (
                        <button
                            key={protocol.id}
                            onClick={() => setActiveProtocol(protocol.id)}
                            className={`p-4 rounded-lg border-2 transition-all ${activeProtocol === protocol.id
                                    ? 'border-purple-500 bg-purple-50 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <div className="text-center">
                                <span className="text-3xl mb-2 block">{protocol.icon}</span>
                                <h4 className={`font-semibold text-sm ${activeProtocol === protocol.id ? 'text-purple-700' : 'text-gray-700'
                                    }`}>
                                    {protocol.name}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">{protocol.period}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Active Protocol Info Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-purple-600 text-2xl">
                        {PROTOCOL_TABS.find(p => p.id === activeProtocol)?.materialIcon}
                    </span>
                    <div>
                        <h4 className="font-bold text-gray-900">
                            {PROTOCOL_TABS.find(p => p.id === activeProtocol)?.description}
                        </h4>
                        <p className="text-sm text-gray-600">
                            Período de aplicação: {PROTOCOL_TABS.find(p => p.id === activeProtocol)?.period}
                        </p>
                    </div>
                </div>
            </div>

            {/* Protocol Content */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                {renderProtocolContent()}
            </div>

            {/* Value Proposition Footer */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
                <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-amber-600 text-4xl">workspace_premium</span>
                    <div>
                        <h4 className="font-bold text-amber-900 mb-2">
                            Selo de Excelência em Criação
                        </h4>
                        <p className="text-sm text-amber-800 mb-3">
                            Este filhote passou por um programa completo de bioestímulo, incluindo protocolos
                            neurológicos, olfativos e sensoriais. Todo o processo foi documentado e executado
                            por profissionais qualificados.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div className="bg-white p-2 rounded border border-amber-200">
                                <span className="font-semibold text-amber-900">✓ Super Dogs</span>
                                <p className="text-amber-700">Estimulação neurológica</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-amber-200">
                                <span className="font-semibold text-amber-900">✓ ESI Protocol</span>
                                <p className="text-amber-700">Desenvolvimento olfativo</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-amber-200">
                                <span className="font-semibold text-amber-900">✓ Dessensibilização</span>
                                <p className="text-amber-700">Estabilidade emocional</p>
                            </div>
                            <div className="bg-white p-2 rounded border border-amber-200">
                                <span className="font-semibold text-amber-900">✓ Enriquecimento</span>
                                <p className="text-amber-700">Propriocepção avançada</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BiostimulationProtocols;
