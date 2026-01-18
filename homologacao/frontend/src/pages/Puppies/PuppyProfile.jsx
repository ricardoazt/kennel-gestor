import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import puppyService from '../../services/puppyService';
import ColorPicker, { COLLAR_COLORS } from '../../components/ColorPicker';
import WeightHistory from '../../components/WeightHistory';

const PuppyProfile = () => {
    const { id, code } = useParams();
    const navigate = useNavigate();
    const [puppy, setPuppy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        loadPuppyData();
    }, [id, code]);

    const loadPuppyData = async () => {
        try {
            setLoading(true);
            let data;
            if (code) {
                data = await puppyService.getByCode(code);
            } else {
                data = await puppyService.getById(id);
            }
            setPuppy(data);
            setFormData({
                name: data.name || '',
                gender: data.gender || 'Macho',
                coat_color: data.coat_color || '',
                collar_color: data.collar_color || '',
                status: data.status || 'available'
            });
        } catch (error) {
            console.error('Error loading puppy:', error);
            alert('Erro ao carregar dados do filhote');
            navigate('/ninhadas');
        } finally {
            setLoading(false);
        }
    };

    const handleAddWeight = async (weight, date) => {
        await puppyService.addWeightEntry(puppy.id, weight, date);
        await loadPuppyData();
    };

    const handleSave = async () => {
        try {
            await puppyService.update(puppy.id, formData);
            await loadPuppyData();
            setEditing(false);
        } catch (error) {
            console.error('Error updating puppy:', error);
            alert('Erro ao atualizar filhote');
        }
    };

    const getCollarColorHex = (colorName) => {
        return COLLAR_COLORS.find(c => c.name === colorName)?.color || '#ccc';
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Carregando perfil do filhote...</p>
            </div>
        );
    }

    if (!puppy) return null;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(puppy.litter ? `/ninhadas/${puppy.litter.id}` : '/ninhadas')}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <span className={`material-symbols-outlined ${puppy.gender === 'Macho' ? 'text-blue-500' : 'text-pink-500'}`}>
                                {puppy.gender === 'Macho' ? 'male' : 'female'}
                            </span>
                            {puppy.name || 'Sem Nome'}
                        </h1>
                        <p className="text-gray-600">Código: {puppy.unique_code}</p>
                    </div>
                </div>

                {!editing ? (
                    <button
                        onClick={() => setEditing(true)}
                        className="btn-primary"
                    >
                        <span className="material-symbols-outlined text-sm mr-1">edit</span>
                        Editar
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setEditing(false);
                                setFormData({
                                    name: puppy.name || '',
                                    gender: puppy.gender || 'Macho',
                                    coat_color: puppy.coat_color || '',
                                    collar_color: puppy.collar_color || '',
                                    status: puppy.status || 'available'
                                });
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn-primary"
                        >
                            <span className="material-symbols-outlined text-sm mr-1">save</span>
                            Salvar
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - QR Code and Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* QR Code Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">qr_code</span>
                            QR Code do Filhote
                        </h3>
                        {puppy.qr_code_data ? (
                            <div className="flex flex-col items-center">
                                <img
                                    src={puppy.qr_code_data}
                                    alt="QR Code"
                                    className="w-48 h-48 mb-3"
                                />
                                <p className="text-sm text-gray-600 text-center">
                                    Escaneie para acessar este perfil
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                QR Code não disponível
                            </div>
                        )}
                    </div>

                    {/* Litter Info Card */}
                    {puppy.litter && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                            <h3 className="font-semibold text-gray-900 mb-3">Ninhada</h3>
                            <p className="text-gray-700 font-medium mb-2">
                                {puppy.litter.name || `Ninhada #${puppy.litter.id}`}
                            </p>
                            {puppy.litter.birth_date && (
                                <p className="text-sm text-gray-600 mb-1">
                                    Nascimento: {new Date(puppy.litter.birth_date).toLocaleDateString('pt-BR')}
                                </p>
                            )}

                            {/* Parents */}
                            <div className="mt-4 space-y-2">
                                {puppy.litter.Mother && (
                                    <div className="text-sm">
                                        <span className="text-pink-500 font-medium">♀ Mãe:</span>{' '}
                                        <span className="text-gray-700">{puppy.litter.Mother.nome}</span>
                                    </div>
                                )}
                                {puppy.litter.Father && (
                                    <div className="text-sm">
                                        <span className="text-blue-500 font-medium">♂ Pai:</span>{' '}
                                        <span className="text-gray-700">{puppy.litter.Father.nome}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => navigate(`/ninhadas/${puppy.litter.id}`)}
                                className="mt-4 w-full px-4 py-2 bg-white rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 border border-amber-300"
                            >
                                Ver Ninhada Completa
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Column - Detailed Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">info</span>
                            Informações Básicas
                        </h3>

                        {editing ? (
                            <div className="space-y-4">
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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Macho">Macho</option>
                                            <option value="Fêmea">Fêmea</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Coloração do Pelo</label>
                                    <input
                                        type="text"
                                        value={formData.coat_color}
                                        onChange={(e) => setFormData({ ...formData, coat_color: e.target.value })}
                                        placeholder="Ex: Dourado, Preto, Chocolate, etc."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <ColorPicker
                                    value={formData.collar_color}
                                    onChange={(color) => setFormData({ ...formData, collar_color: color })}
                                    label="Cor da Coleira de Identificação"
                                />

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
                                        <option value="unavailable">Indisponível</option>
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Sexo</p>
                                    <p className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                        <span className={`material-symbols-outlined ${puppy.gender === 'Macho' ? 'text-blue-500' : 'text-pink-500'}`}>
                                            {puppy.gender === 'Macho' ? 'male' : 'female'}
                                        </span>
                                        {puppy.gender}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Status</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${puppy.status === 'available' ? 'bg-green-100 text-green-700' :
                                            puppy.status === 'reserved' ? 'bg-yellow-100 text-yellow-700' :
                                                puppy.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                        }`}>
                                        {puppy.status === 'available' ? 'Disponível' :
                                            puppy.status === 'reserved' ? 'Reservado' :
                                                puppy.status === 'sold' ? 'Vendido' : 'Indisponível'}
                                    </span>
                                </div>

                                {puppy.coat_color && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Coloração do Pelo</p>
                                        <p className="text-lg font-medium text-gray-900">{puppy.coat_color}</p>
                                    </div>
                                )}

                                {puppy.collar_color && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Cor da Coleira</p>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-6 h-6 rounded-full shadow-sm"
                                                style={{
                                                    backgroundColor: getCollarColorHex(puppy.collar_color),
                                                    border: puppy.collar_color === 'Branco' ? '1px solid #d1d5db' : 'none'
                                                }}
                                            />
                                            <p className="text-lg font-medium text-gray-900">{puppy.collar_color}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Weight History Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <WeightHistory
                            puppyId={puppy.id}
                            weightHistory={puppy.weight_history || []}
                            onAddWeight={handleAddWeight}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PuppyProfile;
