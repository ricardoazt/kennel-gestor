import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

function PlantelList() {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnimals();
    }, []);

    async function loadAnimals() {
        try {
            const response = await api.get('/animals');
            setAnimals(response.data);
        } catch (error) {
            console.error('Erro ao carregar plantel:', error);
            alert('Erro ao carregar dados.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Tem certeza que deseja excluir?')) return;
        try {
            await api.delete(`/animals/${id}`);
            loadAnimals();
        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    }

    if (loading) return <div>Carregando...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestão de Plantel</h1>
                <Link to="/plantel/novo" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    + Novo Animal
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {animals.map(animal => (
                            <tr key={animal.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{animal.nome}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{animal.registro || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{animal.sexo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <Link to={`/plantel/${animal.id}`} className="text-indigo-600 hover:text-indigo-900">Perfil</Link>
                                    <Link to={`/plantel/editar/${animal.id}`} className="text-yellow-600 hover:text-yellow-900">Editar</Link>
                                    <button onClick={() => handleDelete(animal.id)} className="text-red-600 hover:text-red-900">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {animals.length === 0 && (
                    <div className="p-6 text-center text-gray-500">Nenhum animal cadastrado.</div>
                )}
            </div>
        </div>
    );
}

export default PlantelList;
