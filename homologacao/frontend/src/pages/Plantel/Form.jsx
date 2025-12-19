import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

function PlantelForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [animals, setAnimals] = useState([]); // For parent selection

    const [formData, setFormData] = useState({
        nome: '',
        registro: '',
        sexo: 'Macho',
        data_nascimento: '',
        cor: '',
        microchip: '',
        pai_id: '',
        mae_id: ''
    });

    useEffect(() => {
        loadAnimals();
        if (id) {
            loadAnimal();
        }
    }, [id]);

    async function loadAnimals() {
        try {
            const response = await api.get('/animals');
            // Filter out self to avoid circular reference in parent selection if editing
            setAnimals(response.data.filter(a => a.id !== parseInt(id)));
        } catch (error) {
            console.error('Erro ao carregar lista para seleção:', error);
        }
    }

    async function loadAnimal() {
        try {
            setLoading(true);
            const response = await api.get(`/animals/${id}`);
            const data = response.data;
            setFormData({
                nome: data.nome,
                registro: data.registro || '',
                sexo: data.sexo,
                data_nascimento: data.data_nascimento || '',
                cor: data.cor || '',
                microchip: data.microchip || '',
                pai_id: data.pai_id || '',
                mae_id: data.mae_id || ''
            });
        } catch (error) {
            alert('Erro ao carregar animal');
            navigate('/plantel');
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            pai_id: formData.pai_id ? parseInt(formData.pai_id) : null,
            mae_id: formData.mae_id ? parseInt(formData.mae_id) : null
        };

        try {
            if (id) {
                await api.put(`/animals/${id}`, payload);
            } else {
                await api.post('/animals', payload);
            }
            navigate('/plantel');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar dados.');
        } finally {
            setLoading(false);
        }
    }

    if (loading && id && !formData.nome) return <div>Carregando...</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{id ? 'Editar Animal' : 'Novo Animal'}</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome *</label>
                    <input
                        type="text"
                        name="nome"
                        required
                        value={formData.nome}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Registro</label>
                        <input
                            type="text"
                            name="registro"
                            value={formData.registro}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sexo *</label>
                        <select
                            name="sexo"
                            value={formData.sexo}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
                        >
                            <option value="Macho">Macho</option>
                            <option value="Femea">Fêmea</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data Nascimento</label>
                        <input
                            type="date"
                            name="data_nascimento"
                            value={formData.data_nascimento}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cor</label>
                        <input
                            type="text"
                            name="cor"
                            value={formData.cor}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Microchip</label>
                    <input
                        type="text"
                        name="microchip"
                        value={formData.microchip}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pai</label>
                        <select
                            name="pai_id"
                            value={formData.pai_id}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
                        >
                            <option value="">-- Selecione --</option>
                            {animals.filter(a => a.sexo === 'Macho').map(a => (
                                <option key={a.id} value={a.id}>{a.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mãe</label>
                        <select
                            name="mae_id"
                            value={formData.mae_id}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
                        >
                            <option value="">-- Selecione --</option>
                            {animals.filter(a => a.sexo === 'Femea').map(a => (
                                <option key={a.id} value={a.id}>{a.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate('/plantel')}
                        className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PlantelForm;
