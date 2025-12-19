import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import PedigreeTree from '../../components/PedigreeTree';
import MedicalList from '../../components/MedicalList';

function PlantelProfile() {
    const { id } = useParams();
    const [animal, setAnimal] = useState(null);
    const [lineage, setLineage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('details'); // details, pedigree, medical

    useEffect(() => {
        loadData();
    }, [id]);

    async function loadData() {
        try {
            setLoading(true);
            const [animalRes, lineageRes] = await Promise.all([
                api.get(`/animals/${id}`),
                api.get(`/animals/${id}/lineage`)
            ]);
            setAnimal(animalRes.data);
            setLineage(lineageRes.data);
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        } finally {
            setLoading(false);
        }
    }

    // Reload mostly for medical records update
    const handleReload = async () => {
        const animalRes = await api.get(`/animals/${id}`);
        setAnimal(animalRes.data);
    };

    if (loading) return <div>Carregando perfil...</div>;
    if (!animal) return <div>Animal não encontrado.</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{animal.nome}</h1>
                    <p className="text-gray-500">Registro: {animal.registro || 'Não registrado'}</p>
                </div>
                <div className="space-x-2">
                    <Link to="/plantel" className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Voltar</Link>
                    <Link to={`/plantel/editar/${id}`} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Editar</Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Detalhes
                    </button>
                    <button
                        onClick={() => setActiveTab('pedigree')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pedigree'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Pedigree Infinito
                    </button>
                    <button
                        onClick={() => setActiveTab('medical')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'medical'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Arquivo Médico
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow p-6">
                {activeTab === 'details' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div><span className="font-bold text-gray-600">Sexo:</span> {animal.sexo}</div>
                        <div><span className="font-bold text-gray-600">Cor:</span> {animal.cor || '-'}</div>
                        <div><span className="font-bold text-gray-600">Nascimento:</span> {animal.data_nascimento || '-'}</div>
                        <div><span className="font-bold text-gray-600">Microchip:</span> {animal.microchip || '-'}</div>
                        <div><span className="font-bold text-gray-600">Cadastrado em:</span> {new Date(animal.createdAt).toLocaleDateString()}</div>
                    </div>
                )}

                {activeTab === 'pedigree' && (
                    <div className="min-w-full overflow-x-auto">
                        <h3 className="text-lg font-bold mb-4">Árvore Genealógica (4 Gerações)</h3>
                        <PedigreeTree lineage={lineage} />
                    </div>
                )}

                {activeTab === 'medical' && (
                    <MedicalList
                        animalId={animal.id}
                        records={animal.medicalRecords}
                        onRecordAdded={handleReload}
                    />
                )}
            </div>
        </div>
    );
}

export default PlantelProfile;
