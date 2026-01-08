import { useState } from 'react';
import api from '../services/api';

function MedicalList({ animalId, records, onRecordAdded }) {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        tipo: 'Displasia',
        descricao: '',
        file: null
    });

    const getFileUrl = (path) => {
        // Assuming backend serves static files correctly
        const baseUrl = api.defaults.baseURL;
        return `${baseUrl}${path}`;
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.file) return alert('Selecione um arquivo');

        setLoading(true);
        const data = new FormData();
        data.append('tipo', formData.tipo);
        data.append('descricao', formData.descricao);
        data.append('file', formData.file);

        try {
            await api.post(`/animals/${animalId}/medical-records`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowForm(false);
            setFormData({ tipo: 'Displasia', descricao: '', file: null });
            if (onRecordAdded) onRecordAdded();
        } catch (error) {
            console.error('Upload failed', error);
            alert('Erro ao enviar arquivo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Arquivo Médico</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                >
                    {showForm ? 'Cancelar' : '+ Adicionar Laudo'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded border">
                    <div className="grid grid-cols-1 gap-3">
                        <select
                            value={formData.tipo}
                            onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                            className="border p-2 rounded"
                        >
                            <option value="Displasia">Displasia</option>
                            <option value="DNA">DNA</option>
                            <option value="Exame">Exame Geral</option>
                            <option value="Outro">Outro</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Descrição (Opcional)"
                            value={formData.descricao}
                            onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input type="file" onChange={handleFileChange} className="border p-2 rounded text-sm" accept=".pdf,.jpg,.png,.jpeg" />
                        <button type="submit" disabled={loading} className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
                            {loading ? 'Enviando...' : 'Salvar Arquivo'}
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {records && records.map(rec => (
                    <div key={rec.id} className="border rounded bg-white p-4 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${rec.tipo === 'Displasia' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                {rec.tipo}
                            </span>
                            <p className="mt-2 text-sm text-gray-600">{rec.descricao || 'Sem descrição'}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(rec.createdAt).toLocaleDateString()}</p>
                        </div>
                        <a
                            href={getFileUrl(rec.arquivo_path)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 text-center text-blue-600 text-sm hover:underline block bg-blue-50 py-1 rounded"
                        >
                            Visualizar Arquivo
                        </a>
                    </div>
                ))}
                {(!records || records.length === 0) && <p className="text-gray-500 text-sm col-span-3">Nenhum registro médico encontrado.</p>}
            </div>
        </div>
    );
}

export default MedicalList;
