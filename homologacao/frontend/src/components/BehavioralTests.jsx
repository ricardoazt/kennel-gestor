import React, { useState, useEffect } from 'react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import testService from '../services/testService';

const BehavioralTests = ({ puppyId }) => {
    const [templates, setTemplates] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewTestModal, setShowNewTestModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [formData, setFormData] = useState({});
    const [notes, setNotes] = useState('');

    useEffect(() => {
        loadData();
    }, [puppyId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [templatesData, resultsData] = await Promise.all([
                testService.getTemplates(),
                testService.getResultsByPuppy(puppyId)
            ]);
            setTemplates(templatesData);
            setResults(resultsData);
        } catch (error) {
            console.error('Error loading test data:', error);
            alert('Erro ao carregar dados dos testes.');
        } finally {
            setLoading(false);
        }
    };

    const handleStartTest = (template) => {
        setSelectedTemplate(template);
        // Initialize form data with middle values or 0
        const initialData = {};
        template.parameters.forEach(p => {
            // Default to strict middle or minimum
            initialData[p.name] = p.min_score;
        });
        setFormData(initialData);
        setNotes('');
        setShowNewTestModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await testService.saveResult({
                puppy_id: puppyId,
                test_template_id: selectedTemplate.id,
                scores: formData,
                notes: notes,
                date: new Date()
            });
            setShowNewTestModal(false);
            setSelectedTemplate(null);
            loadData(); // Refresh list
        } catch (error) {
            console.error('Error saving result:', error);
            alert('Erro ao salvar o teste.');
        }
    };

    if (loading) return <div className="p-4 text-center text-gray-500">Carregando testes...</div>;

    return (
        <div className="space-y-8">
            {/* Header / Actions */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-600">psychology</span>
                    Testes Comportamentais
                </h2>
                <button
                    onClick={() => setShowNewTestModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add</span>
                    Novo Teste
                </button>
            </div>

            {/* Results Grid - Radar Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map(result => {
                    // Prepare data for Radar Chart
                    const chartData = result.template.parameters.map(param => ({
                        subject: param.name,
                        A: result.scores[param.name] || 0,
                        fullMark: param.max_score
                    }));

                    return (
                        <div key={result.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{result.template.name}</h3>
                                    <p className="text-sm text-gray-500">{new Date(result.date).toLocaleDateString()}</p>
                                </div>
                                <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                                    Concluído
                                </div>
                            </div>

                            <div className="h-[300px] w-full -ml-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                                        <Radar
                                            name={result.template.name}
                                            dataKey="A"
                                            stroke="#8b5cf6"
                                            fill="#8b5cf6"
                                            fillOpacity={0.4}
                                        />
                                        <Tooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            {result.notes && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                                    <strong>Notas:</strong> {result.notes}
                                </div>
                            )}
                        </div>
                    );
                })}

                {results.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <span className="material-symbols-outlined text-gray-400 text-5xl mb-2">assignment</span>
                        <p className="text-gray-500">Nenhum teste realizado ainda.</p>
                        <button onClick={() => setShowNewTestModal(true)} className="text-purple-600 font-medium hover:underline mt-2">
                            Realizar o primeiro teste
                        </button>
                    </div>
                )}
            </div>

            {/* Modal for New Test */}
            {showNewTestModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                        {!selectedTemplate ? (
                            // Step 1: Select Template
                            <div className="p-6 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Escolha um Teste</h3>
                                    <button onClick={() => setShowNewTestModal(false)} className="text-gray-500 hover:text-gray-700">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1 p-1">
                                    {templates.map(template => (
                                        <div
                                            key={template.id}
                                            onClick={() => handleStartTest(template)}
                                            className="border border-gray-200 rounded-xl p-4 hover:border-purple-500 hover:shadow-md cursor-pointer transition-all group"
                                        >
                                            <h4 className="font-bold text-purple-700 mb-2 group-hover:text-purple-900">{template.name}</h4>
                                            <p className="text-sm text-gray-600 line-clamp-3">{template.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Step 2: Evaluation Form
                            <div className="flex flex-col h-full">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-purple-50 rounded-t-xl">
                                    <div>
                                        <h3 className="text-2xl font-bold text-purple-900">{selectedTemplate.name}</h3>
                                        <p className="text-purple-700 text-sm">{selectedTemplate.description}</p>
                                    </div>
                                    <button onClick={() => setSelectedTemplate(null)} className="text-purple-400 hover:text-purple-700">
                                        Voltar
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        {selectedTemplate.parameters.map((param, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <label className="block text-lg font-semibold text-gray-900">{param.name}</label>
                                                        <p className="text-sm text-gray-500">{param.description}</p>
                                                    </div>
                                                    <div className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">
                                                        Max: {param.max_score}
                                                    </div>
                                                </div>

                                                {/* Score Input - Range Slider with value display */}
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="range"
                                                        min={param.min_score}
                                                        max={param.max_score}
                                                        step="1"
                                                        value={formData[param.name] || param.min_score}
                                                        onChange={(e) => setFormData({ ...formData, [param.name]: parseInt(e.target.value) })}
                                                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                                    />
                                                    <span className="text-2xl font-bold text-purple-600 w-12 text-center">
                                                        {formData[param.name]}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                                                    <span>Min ({param.min_score})</span>
                                                    <span>Max ({param.max_score})</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Observações Gerais</label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            rows="3"
                                            placeholder="Comportamentos não capturados pelas pontuações..."
                                        />
                                    </div>
                                </form>

                                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowNewTestModal(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-white text-gray-700 font-medium"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-md transition-all"
                                    >
                                        Salvar Resultado
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BehavioralTests;
