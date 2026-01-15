import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import litterService from '../../services/litterService';
import puppyService from '../../services/puppyService';

const LitterForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const pregnancyData = location.state || {};

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        father_id: pregnancyData.fatherId || '',
        mother_id: pregnancyData.motherId || '',
        birth_date: pregnancyData.birthDate || new Date().toISOString().split('T')[0],
        total_males: 0,
        total_females: 0,
        name: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate parent IDs
        if (!formData.father_id || !formData.mother_id) {
            alert('Erro: IDs do pai e mãe não foram informados. Por favor, volte à página de gestação e confirme o nascimento novamente.');
            console.error('Missing parent IDs:', { father_id: formData.father_id, mother_id: formData.mother_id, pregnancyData });
            return;
        }

        if (formData.total_males === 0 && formData.total_females === 0) {
            alert('Informe pelo menos 1 macho ou 1 fêmea');
            return;
        }

        try {
            setLoading(true);

            // Create litter with validated data
            const litterData = {
                father_id: parseInt(formData.father_id),
                mother_id: parseInt(formData.mother_id),
                birth_date: formData.birth_date,
                name: formData.name || null,
                total_males: parseInt(formData.total_males),
                total_females: parseInt(formData.total_females),
                status: 'born',
                available_males: parseInt(formData.total_males),
                available_females: parseInt(formData.total_females)
            };

            console.log('Creating litter with data:', litterData);
            const litter = await litterService.create(litterData);

            // Create puppies automatically
            const puppyPromises = [];

            // Create male puppies
            for (let i = 1; i <= formData.total_males; i++) {
                puppyPromises.push(
                    puppyService.create({
                        litter_id: litter.id,
                        gender: 'Macho',
                        name: `Filhote ${i}`,
                        birth_date: formData.birth_date
                    })
                );
            }

            // Create female puppies
            for (let i = 1; i <= formData.total_females; i++) {
                puppyPromises.push(
                    puppyService.create({
                        litter_id: litter.id,
                        gender: 'Femea',
                        name: `Filhote ${formData.total_males + i}`,
                        birth_date: formData.birth_date
                    })
                );
            }

            await Promise.all(puppyPromises);

            // Navigate to litter detail page
            navigate(`/ninhadas/${litter.id}`);
        } catch (error) {
            console.error('Error creating litter:', error);
            console.error('Error response:', error.response);
            alert('Erro ao criar ninhada: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-gray-900 text-2xl font-bold">Registrar Ninhada</h1>
                    <p className="text-gray-600">Complete os dados da ninhada nascida</p>
                </div>
                <button
                    onClick={() => navigate('/ninhadas')}
                    className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Voltar
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 max-w-2xl">
                {/* Parent info alert */}
                {pregnancyData.fatherName && pregnancyData.motherName && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-blue-500">info</span>
                            <span className="font-semibold text-blue-900">Dados da Gestação</span>
                        </div>
                        <div className="text-sm text-blue-800">
                            <p><strong>Mãe:</strong> {pregnancyData.motherName} (ID: {formData.mother_id || 'não informado'})</p>
                            <p><strong>Pai:</strong> {pregnancyData.fatherName} (ID: {formData.father_id || 'não informado'})</p>
                        </div>
                    </div>
                )}

                {/* Warning if no pregnancy data */}
                {(!pregnancyData.fatherName || !pregnancyData.motherName) && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-amber-600">warning</span>
                            <span className="font-semibold text-amber-900">Aviso</span>
                        </div>
                        <div className="text-sm text-amber-800">
                            <p>Esta ninhada não foi criada a partir de uma gestação confirmada.</p>
                            <p className="mt-1">Por favor, selecione o pai e a mãe manualmente ou volte à página de gestação.</p>
                        </div>
                    </div>
                )}


                <div className="space-y-6">
                    {/* Litter name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome da Ninhada (opcional)
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Ninhada Primavera 2026"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Birth date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <span className="material-symbols-outlined text-base align-middle mr-1">event</span>
                            Data de Nascimento *
                        </label>
                        <input
                            type="date"
                            value={formData.birth_date}
                            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                            required
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Puppy counts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <span className="material-symbols-outlined text-base align-middle mr-1 text-blue-500">male</span>
                                Quantidade de Machos *
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.total_males}
                                onChange={(e) => setFormData({ ...formData, total_males: parseInt(e.target.value) || 0 })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <span className="material-symbols-outlined text-base align-middle mr-1 text-pink-500">female</span>
                                Quantidade de Fêmeas *
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.total_females}
                                onChange={(e) => setFormData({ ...formData, total_females: parseInt(e.target.value) || 0 })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Total count display */}
                    {(formData.total_males > 0 || formData.total_females > 0) && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-green-800 font-semibold">
                                Total: {formData.total_males + formData.total_females} filhote(s)
                            </p>
                            <p className="text-sm text-green-700 mt-1">
                                Serão criados {formData.total_males + formData.total_females} cards de filhotes automaticamente
                            </p>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/ninhadas')}
                            disabled={loading}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary disabled:opacity-50"
                        >
                            {loading ? 'Criando...' : 'Criar Ninhada'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LitterForm;
