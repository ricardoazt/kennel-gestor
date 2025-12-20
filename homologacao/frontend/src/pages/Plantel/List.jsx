import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function PlantelList() {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterColor, setFilterColor] = useState('');
    const [filterSex, setFilterSex] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadAnimals();
    }, []);

    async function loadAnimals() {
        try {
            const response = await api.get('/animals');
            // Enrich data with mock fields for demo
            const enrichedData = response.data.map(animal => ({
                ...animal,
                microchip: animal.microchip || `MC${Math.floor(Math.random() * 1000000000)}`,
                cor: animal.cor || getRandomColor(),
                data_nascimento: animal.data_nascimento || getRandomBirthDate(),
                status: animal.status || getRandomStatus(),
                proximo_evento: getRandomEvent(),
                foto: animal.foto || `https://source.unsplash.com/100x100/?dog,${animal.id}`
            }));
            setAnimals(enrichedData);
        } catch (error) {
            console.error('Erro ao carregar plantel:', error);
            setAnimals(getMockAnimals());
        } finally {
            setLoading(false);
        }
    }

    function getRandomColor() {
        const colors = ['Dourado', 'Preto', 'Branco', 'Tricolor', 'Marrom'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function getRandomBirthDate() {
        const year = 2018 + Math.floor(Math.random() * 5);
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    function getRandomStatus() {
        const statuses = ['Apto', 'Aposentado', 'Filhote', 'Castrado'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }

    function getRandomEvent() {
        const events = [
            { tipo: 'Vacina V10', data: 'Hoje', icon: 'vaccines', color: 'orange' },
            { tipo: 'Checkup Geral', data: 'Em 5 dias', icon: 'medical_services', color: 'blue' },
            { tipo: 'Vermífugo', data: 'Em 12 dias', icon: 'medication', color: 'purple' },
            { tipo: 'Banho e Tosa', data: 'Amanhã', icon: 'content_cut', color: 'green' }
        ];
        return events[Math.floor(Math.random() * events.length)];
    }

    function getMockAnimals() {
        return [
            {
                id: 1,
                nome: 'Max',
                microchip: '982000312',
                sexo: 'Macho',
                cor: 'Dourado',
                data_nascimento: '2020-05-12',
                status: 'Apto',
                proximo_evento: { tipo: 'Vacina V10', data: 'Hoje', icon: 'vaccines', color: 'orange' },
                foto: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=100&h=100&fit=crop'
            },
            {
                id: 2,
                nome: 'Luna',
                microchip: '982555102',
                sexo: 'Fêmea',
                cor: 'Preto',
                data_nascimento: '2018-01-22',
                status: 'Aposentado',
                proximo_evento: { tipo: 'Checkup Geral', data: 'Em 5 dias', icon: 'medical_services', color: 'blue' },
                foto: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=100&h=100&fit=crop'
            },
            {
                id: 3,
                nome: 'Thor',
                microchip: '981002231',
                sexo: 'Macho',
                cor: 'Tricolor',
                data_nascimento: '2022-10-10',
                status: 'Filhote',
                proximo_evento: { tipo: 'Vermífugo', data: 'Em 12 dias', icon: 'medication', color: 'purple' },
                foto: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&h=100&fit=crop'
            }
        ];
    }

    function calculateAge(birthDate) {
        const birth = new Date(birthDate);
        const today = new Date();
        const months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();

        if (months < 12) {
            return `${months} ${months === 1 ? 'Mês' : 'Meses'}`;
        }
        const years = Math.floor(months / 12);
        return `${years} ${years === 1 ? 'Ano' : 'Anos'}`;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
    }

    function getColorIndicator(color) {
        const colorMap = {
            'Dourado': 'bg-yellow-600',
            'Preto': 'bg-slate-800',
            'Branco': 'bg-stone-100 border border-stone-300',
            'Tricolor': 'bg-amber-700',
            'Marrom': 'bg-amber-800'
        };
        return colorMap[color] || 'bg-gray-400';
    }

    function getStatusBadge(status) {
        const statusMap = {
            'Apto': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
            'Aposentado': { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' },
            'Filhote': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
            'Castrado': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' }
        };
        return statusMap[status] || statusMap['Apto'];
    }

    function getEventColor(color) {
        const colorMap = {
            'orange': { bg: 'bg-orange-50', text: 'text-orange-600' },
            'blue': { bg: 'bg-blue-50', text: 'text-blue-600' },
            'purple': { bg: 'bg-purple-50', text: 'text-purple-600' },
            'green': { bg: 'bg-green-50', text: 'text-green-600' }
        };
        return colorMap[color] || colorMap['blue'];
    }

    const filteredAnimals = animals.filter(animal => {
        const matchesSearch = animal.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            animal.microchip.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesColor = !filterColor || animal.cor === filterColor;
        const matchesSex = !filterSex || animal.sexo === filterSex;
        const matchesStatus = !filterStatus || animal.status === filterStatus;

        return matchesSearch && matchesColor && matchesSex && matchesStatus;
    });

    function clearFilters() {
        setSearchTerm('');
        setFilterColor('');
        setFilterSex('');
        setFilterStatus('');
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-slate-500">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                {/* Page Heading & Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">Visão Geral dos Cães</h2>
                        <p className="text-slate-500 mt-1">Gerencie o registro vital, status e agenda de cada cão.</p>
                    </div>
                    <Link
                        to="/plantel/novo"
                        className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Novo Cadastro</span>
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center">
                    {/* Search */}
                    <div className="relative w-full lg:max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                            className="block w-full pl-10 pr-3 py-2.5 border ring-1 ring-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm placeholder:text-slate-400 text-slate-900 transition-all"
                            placeholder="Buscar por nome ou microchip..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Chips */}
                    <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-start lg:justify-end">
                        <select
                            className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-primary/50 text-slate-700 text-sm font-medium transition-all focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={filterColor}
                            onChange={(e) => setFilterColor(e.target.value)}
                        >
                            <option value="">Cor</option>
                            <option value="Dourado">Dourado</option>
                            <option value="Preto">Preto</option>
                            <option value="Branco">Branco</option>
                            <option value="Tricolor">Tricolor</option>
                            <option value="Marrom">Marrom</option>
                        </select>

                        <select
                            className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-primary/50 text-slate-700 text-sm font-medium transition-all focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={filterSex}
                            onChange={(e) => setFilterSex(e.target.value)}
                        >
                            <option value="">Sexo</option>
                            <option value="Macho">Macho</option>
                            <option value="Fêmea">Fêmea</option>
                        </select>

                        <select
                            className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-primary/50 text-slate-700 text-sm font-medium transition-all focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">Status</option>
                            <option value="Apto">Apto</option>
                            <option value="Aposentado">Aposentado</option>
                            <option value="Filhote">Filhote</option>
                            <option value="Castrado">Castrado</option>
                        </select>

                        <button
                            onClick={clearFilters}
                            className="flex items-center justify-center size-9 rounded-lg bg-slate-50 border border-slate-200 hover:text-primary hover:border-primary/50 text-slate-500 transition-colors"
                            title="Limpar Filtros"
                        >
                            <span className="material-symbols-outlined text-[20px]">filter_alt_off</span>
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 pl-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cão</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Características</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Idade / Nasc.</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Próximo Evento</th>
                                    <th className="p-4 pr-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredAnimals.map(animal => {
                                    const statusStyle = getStatusBadge(animal.status);
                                    const eventStyle = getEventColor(animal.proximo_evento?.color);

                                    return (
                                        <tr key={animal.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="size-10 rounded-lg bg-cover bg-center shrink-0 border border-slate-200"
                                                        style={{ backgroundImage: `url(${animal.foto})` }}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                                                            {animal.nome}
                                                        </span>
                                                        <span className="text-xs text-slate-500">MC: {animal.microchip}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1 text-sm text-slate-700">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className={`size-2 rounded-full ${getColorIndicator(animal.cor)}`}></span>
                                                        {animal.cor}
                                                    </span>
                                                    <span className={`flex items-center gap-1.5 font-medium ${animal.sexo === 'Macho' ? 'text-blue-600' : 'text-pink-600'}`}>
                                                        <span className="material-symbols-outlined text-[16px]">
                                                            {animal.sexo === 'Macho' ? 'male' : 'female'}
                                                        </span>
                                                        {animal.sexo}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-900 text-sm">
                                                        {calculateAge(animal.data_nascimento)}
                                                    </span>
                                                    <span className="text-xs text-slate-500">{formatDate(animal.data_nascimento)}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                                                    <span className={`size-1.5 rounded-full ${statusStyle.dot}`}></span>
                                                    {animal.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {animal.proximo_evento && (
                                                    <div className="flex items-center gap-2">
                                                        <div className={`p-2 ${eventStyle.bg} rounded-lg ${eventStyle.text}`}>
                                                            <span className="material-symbols-outlined text-[18px]">
                                                                {animal.proximo_evento.icon}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-slate-900">
                                                                {animal.proximo_evento.tipo}
                                                            </span>
                                                            <span className={`text-xs font-medium ${animal.proximo_evento.data === 'Hoje' ? 'text-red-500' : 'text-slate-500'}`}>
                                                                {animal.proximo_evento.data}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/plantel/${animal.id}`)}
                                                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                        title="Ver Perfil"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/plantel/editar/${animal.id}`)}
                                                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredAnimals.length === 0 && (
                        <div className="p-6 text-center text-slate-500">
                            {searchTerm || filterColor || filterSex || filterStatus
                                ? 'Nenhum animal encontrado com os filtros aplicados.'
                                : 'Nenhum animal cadastrado.'}
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredAnimals.length > 0 && (
                        <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-white">
                            <div className="text-sm text-slate-500">
                                Mostrando <span className="font-semibold text-slate-900">1</span> a{' '}
                                <span className="font-semibold text-slate-900">{filteredAnimals.length}</span> de{' '}
                                <span className="font-semibold text-slate-900">{filteredAnimals.length}</span> cães
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PlantelList;
