import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import litterService from '../../services/litterService';
import puppyService from '../../services/puppyService';

const LitterDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [litter, setLitter] = useState(null);
    const [puppies, setPuppies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPuppy, setSelectedPuppy] = useState(null);
    const [showPuppyModal, setShowPuppyModal] = useState(false);

    useEffect(() => {
        loadLitterData();
    }, [id]);

    const loadLitterData = async () => {
        try {
            setLoading(true);
            const [litterData, puppiesData] = await Promise.all([
                litterService.getById(id),
                puppyService.getByLitter(id)
            ]);
            setLitter(litterData);
            setPuppies(puppiesData);
        } catch (error) {
            console.error('Error loading litter data:', error);
            alert('Erro ao carregar dados da ninhada');
            navigate('/ninhadas');
        } finally {
            setLoading(false);
        }
    };

    const handlePuppyClick = (puppy) => {
        navigate(`/filhotes/${puppy.id}`);
    };

    const handlePuppyUpdate = async (puppyId, data) => {
        try {
            await puppyService.update(puppyId, data);
            loadLitterData();
            setShowPuppyModal(false);
        } catch (error) {
            console.error('Error updating puppy:', error);
            alert('Erro ao atualizar filhote');
        }
    };

    const handleDownloadPDF = () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        window.open(`${apiUrl}/api/litters/${id}/pdf`, '_blank');
    };

    const calculateAge = (birthDate) => {
        const days = litterService.calculatePuppyAge(birthDate);
        if (days === 0) return 'Nascido hoje';
        if (days === 1) return '1 dia';
        if (days < 7) return `${days} dias`;
        const weeks = Math.floor(days / 7);
        if (weeks === 1) return '1 semana';
        return `${weeks} semanas`;
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Carregando ninhada...</p>
            </div>
        );
    }

    if (!litter) return null;

    const age = calculateAge(litter.birth_date);

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <button
                            onClick={() => navigate('/ninhadas')}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="text-gray-900 text-2xl font-bold">
                            {litter.name || `Ninhada #${litter.id}`}
                        </h1>
                    </div>
                    <p className="text-gray-600 ml-12">{age} • {puppies.length} filhote{puppies.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={handleDownloadPDF}
                    className="btn-primary flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">picture_as_pdf</span>
                    Gerar PDF da Ninhada
                </button>
            </div>

            {/* Parent info card */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-8 border border-amber-200">
                <h3 className="font-semibold text-gray-900 mb-4">Informações dos Pais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200">
                            {litter.Mother?.photos?.[0] ? (
                                <img
                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${litter.Mother.photos[0]}`}
                                    alt={litter.Mother.nome}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-gray-400 text-4xl">pets</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-pink-500">female</span>
                                <span className="font-semibold text-gray-900">Mãe</span>
                            </div>
                            <p className="text-gray-700">{litter.Mother?.nome}</p>
                            {litter.Mother?.registro && (
                                <p className="text-sm text-gray-500">{litter.Mother.registro}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200">
                            {litter.Father?.photos?.[0] ? (
                                <img
                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${litter.Father.photos[0]}`}
                                    alt={litter.Father.nome}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-gray-400 text-4xl">pets</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-blue-500">male</span>
                                <span className="font-semibold text-gray-900">Pai</span>
                            </div>
                            <p className="text-gray-700">{litter.Father?.nome}</p>
                            {litter.Father?.registro && (
                                <p className="text-sm text-gray-500">{litter.Father.registro}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Puppies section */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Filhotes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {puppies.map(puppy => (
                        <div
                            key={puppy.id}
                            onClick={() => handlePuppyClick(puppy)}
                            className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-blue-300"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`material-symbols-outlined ${puppy.gender === 'Macho' ? 'text-blue-500' : 'text-pink-500'}`}>
                                        {puppy.gender === 'Macho' ? 'male' : 'female'}
                                    </span>
                                    <span className="font-semibold text-gray-900">{puppy.name}</span>
                                </div>
                                {puppy.status && (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${puppy.status === 'available' ? 'bg-green-100 text-green-700' :
                                        puppy.status === 'reserved' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {puppy.status === 'available' ? 'Disponível' :
                                            puppy.status === 'reserved' ? 'Reservado' : 'Vendido'}
                                    </span>
                                )}
                            </div>
                            <div className="space-y-1">
                                {puppy.coat_color && (
                                    <p className="text-sm text-gray-600">Coloração: {puppy.coat_color}</p>
                                )}
                                {puppy.collar_color && (
                                    <p className="text-sm text-gray-600">Coleira: {puppy.collar_color}</p>
                                )}
                                {puppy.unique_code && (
                                    <p className="text-xs text-gray-500 font-mono">{puppy.unique_code}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Puppy Modal */}
            {showPuppyModal && selectedPuppy && (
                <PuppyModal
                    puppy={selectedPuppy}
                    onClose={() => setShowPuppyModal(false)}
                    onUpdate={(data) => handlePuppyUpdate(selectedPuppy.id, data)}
                />
            )}
        </div>
    );
};

// Puppy Modal Component
const PuppyModal = ({ puppy, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: puppy.name || '',
        color: puppy.color || '',
        weight: puppy.weight || '',
        microchip: puppy.microchip || '',
        notes: puppy.notes || '',
        status: puppy.status || 'available'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onUpdate(formData);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-t-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">{puppy.name}</h2>
                            <p className="text-amber-100 flex items-center gap-2">
                                <span className="material-symbols-outlined">
                                    {puppy.gender === 'Macho' ? 'male' : 'female'}
                                </span>
                                {puppy.gender}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="available">Disponível</option>
                                <option value="reserved">Reservado</option>
                                <option value="sold">Vendido</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
                            <input
                                type="text"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                placeholder="Ex: Dourado, Preto, Chocolate"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Peso (gramas)</label>
                            <input
                                type="number"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                placeholder="Ex: 450"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Microchip</label>
                        <input
                            type="text"
                            value={formData.microchip}
                            onChange={(e) => setFormData({ ...formData, microchip: e.target.value })}
                            placeholder="Número do microchip"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Anotações sobre o filhote..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary"
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LitterDetail;
