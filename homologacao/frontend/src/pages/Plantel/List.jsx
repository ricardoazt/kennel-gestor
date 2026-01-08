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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // 8 items per page (2 rows of 4)
    const navigate = useNavigate();

    useEffect(() => {
        loadAnimals();
    }, []);

    async function loadAnimals() {
        try {
            const response = await api.get('/animals');

            // Map of German Shepherd photos by microchip
            const photoMap = {
                '982000456789': 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=400&fit=crop',
                '982000567890': 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=400&h=400&fit=crop',
                '982000678901': 'https://images.unsplash.com/photo-1590536334027-c5d0d1d0b5b7?w=400&h=400&fit=crop',
                '982000789012': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
                '982000890123': 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&h=400&fit=crop',
                '982000901234': 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=400&fit=crop'
            };

            const enrichedData = response.data.map(animal => {
                const age = calculateAgeInYears(animal.data_nascimento);
                let status = 'Apto';

                // Determine status based on age and registration
                if (age < 2) {
                    status = 'Filhote';
                } else if (age > 8) {
                    status = 'Aposentado';
                } else if (!animal.registro) {
                    status = 'Filhote';
                }

                return {
                    ...animal,
                    status: status,
                    proximo_evento: getEventForAnimal(animal, status),
                    foto: photoMap[animal.microchip] || `https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=400&fit=crop&sig=${animal.id}`
                };
            });

            setAnimals(enrichedData);
        } catch (error) {
            console.error('Erro ao carregar plantel:', error);
            setAnimals(getMockAnimals());
        } finally {
            setLoading(false);
        }
    }

    function calculateAgeInYears(birthDate) {
        const birth = new Date(birthDate);
        const today = new Date();
        return Math.floor((today - birth) / (365.25 * 24 * 60 * 60 * 1000));
    }

    function getEventForAnimal(animal, status) {
        const events = {
            'Filhote': [
                { tipo: 'Vacina V10', data: 'Hoje', icon: 'vaccines', color: 'orange' },
                { tipo: 'Vermífugo', data: 'Em 12 dias', icon: 'medication', color: 'purple' },
                { tipo: 'Checkup Geral', data: 'Em 5 dias', icon: 'medical_services', color: 'blue' }
            ],
            'Apto': [
                { tipo: 'Vacina V10', data: 'Hoje', icon: 'vaccines', color: 'orange' },
                { tipo: 'Checkup Geral', data: 'Em 5 dias', icon: 'medical_services', color: 'blue' },
                { tipo: 'Banho e Tosa', data: 'Amanhã', icon: 'content_cut', color: 'green' },
                { tipo: 'Vermífugo', data: 'Em 12 dias', icon: 'medication', color: 'purple' }
            ],
            'Aposentado': [
                { tipo: 'Checkup Geral', data: 'Em 5 dias', icon: 'medical_services', color: 'blue' },
                { tipo: 'Banho e Tosa', data: 'Amanhã', icon: 'content_cut', color: 'green' }
            ],
            'Castrado': [
                { tipo: 'Checkup Geral', data: 'Em 5 dias', icon: 'medical_services', color: 'blue' },
                { tipo: 'Banho e Tosa', data: 'Amanhã', icon: 'content_cut', color: 'green' }
            ]
        };

        const eventList = events[status] || events['Apto'];
        const hash = animal.id % eventList.length;
        return eventList[hash];
    }

    function getMockAnimals() {
        return [
            {
                id: 1,
                nome: 'Rex von Haus',
                raca: 'Pastor Alemão',
                microchip: '982000456789',
                sexo: 'Macho',
                cor: 'Preto e Dourado',
                data_nascimento: '2019-03-15',
                status: 'Apto',
                proximo_evento: { tipo: 'Vacina Antirrábica', data: 'Em 3 dias', icon: 'vaccines', color: 'orange' },
                foto: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=400&fit=crop'
            },
            {
                id: 2,
                nome: 'Asha vom Berg',
                raca: 'Pastor Alemão',
                microchip: '982000567890',
                sexo: 'Fêmea',
                cor: 'Preto e Marrom',
                data_nascimento: '2020-07-22',
                status: 'Apto',
                proximo_evento: { tipo: 'Checkup Geral', data: 'Amanhã', icon: 'medical_services', color: 'blue' },
                foto: 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=400&h=400&fit=crop'
            },
            {
                id: 3,
                nome: 'Kaiser',
                raca: 'Pastor Alemão',
                microchip: '982000678901',
                sexo: 'Macho',
                cor: 'Preto e Dourado',
                data_nascimento: '2018-11-08',
                status: 'Aposentado',
                proximo_evento: { tipo: 'Fisioterapia', data: 'Em 7 dias', icon: 'healing', color: 'green' },
                foto: 'https://images.unsplash.com/photo-1590536334027-c5d0d1d0b5b7?w=400&h=400&fit=crop'
            },
            {
                id: 4,
                nome: 'Luna vom Wald',
                raca: 'Pastor Alemão',
                microchip: '982000789012',
                sexo: 'Fêmea',
                cor: 'Preto e Marrom',
                data_nascimento: '2021-05-30',
                status: 'Apto',
                proximo_evento: { tipo: 'Vermífugo', data: 'Hoje', icon: 'medication', color: 'purple' },
                foto: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop'
            },
            {
                id: 5,
                nome: 'Bruno',
                raca: 'Pastor Alemão',
                microchip: '982000890123',
                sexo: 'Macho',
                cor: 'Preto e Dourado',
                data_nascimento: '2023-02-14',
                status: 'Filhote',
                proximo_evento: { tipo: 'Vacina V10', data: 'Em 2 dias', icon: 'vaccines', color: 'orange' },
                foto: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&h=400&fit=crop'
            },
            {
                id: 6,
                nome: 'Freya von Stern',
                raca: 'Pastor Alemão',
                microchip: '982000901234',
                sexo: 'Fêmea',
                cor: 'Preto e Marrom',
                data_nascimento: '2019-09-12',
                status: 'Apto',
                proximo_evento: { tipo: 'Banho e Tosa', data: 'Em 5 dias', icon: 'content_cut', color: 'green' },
                foto: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=400&fit=crop'
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
        const day = date.getDate();
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `(${day} ${month}, ${year})`;
    }

    function getColorIndicator(color) {
        const colorMap = {
            'Dourado': 'bg-yellow-500',
            'Preto': 'bg-slate-800',
            'Branco': 'bg-white border border-slate-300',
            'Tricolor': 'bg-gradient-to-r from-amber-800 via-white to-slate-800',
            'Marrom': 'bg-amber-700',
            'Preto e Dourado': 'bg-gradient-to-r from-slate-800 to-yellow-600',
            'Preto e Marrom': 'bg-gradient-to-r from-slate-800 to-amber-800'
        };
        return colorMap[color] || 'bg-gray-400';
    }

    function getStatusBadge(status) {
        const statusMap = {
            'Apto': { bg: 'bg-emerald-500', text: 'text-white', icon: '●' },
            'Aposentado': { bg: 'bg-blue-500', text: 'text-white', icon: '●' },
            'Filhote': { bg: 'bg-sky-500', text: 'text-white', icon: '●' },
            'Castrado': { bg: 'bg-orange-500', text: 'text-white', icon: '●' }
        };
        return statusMap[status] || statusMap['Apto'];
    }

    function getEventColor(color) {
        const colorMap = {
            'orange': { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-500' },
            'blue': { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
            'purple': { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' },
            'green': { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-500' }
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

    // Pagination calculations
    const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAnimals = filteredAnimals.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterColor, filterSex, filterStatus]);

    function goToPage(page) {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function getPageNumbers() {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    }

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
        <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-1">Visão Geral dos Cães</h1>
                        <p className="text-slate-500">Gerencie o registro vital, status e agenda de cada cão.</p>
                    </div>
                    <Link
                        to="/plantel/novo"
                        className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Novo Cadastro</span>
                    </Link>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            type="text"
                            placeholder="Buscar por nome ou microchip..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2">
                        <select
                            value={filterColor}
                            onChange={(e) => setFilterColor(e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                        >
                            <option value="">Cor</option>
                            <option value="Dourado">Dourado</option>
                            <option value="Preto">Preto</option>
                            <option value="Branco">Branco</option>
                            <option value="Tricolor">Tricolor</option>
                            <option value="Marrom">Marrom</option>
                            <option value="Preto e Dourado">Preto e Dourado</option>
                            <option value="Preto e Marrom">Preto e Marrom</option>
                        </select>

                        <select
                            value={filterSex}
                            onChange={(e) => setFilterSex(e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                        >
                            <option value="">Sexo</option>
                            <option value="Macho">Macho</option>
                            <option value="Fêmea">Fêmea</option>
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                        >
                            <option value="">Status</option>
                            <option value="Apto">Apto</option>
                            <option value="Aposentado">Aposentado</option>
                            <option value="Filhote">Filhote</option>
                            <option value="Castrado">Castrado</option>
                        </select>

                        <button
                            onClick={clearFilters}
                            className="p-2.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
                            title="Limpar Filtros"
                        >
                            <span className="material-symbols-outlined text-[20px]">filter_alt_off</span>
                        </button>
                    </div>
                </div>

                {/* Cards Grid */}
                {filteredAnimals.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-slate-100 rounded-full">
                                <span className="material-symbols-outlined text-[48px] text-slate-400">pets</span>
                            </div>
                            <p className="text-slate-500 text-lg">
                                {searchTerm || filterColor || filterSex || filterStatus
                                    ? 'Nenhum animal encontrado com os filtros aplicados.'
                                    : 'Nenhum animal cadastrado.'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6">
                            {currentAnimals.map(animal => {
                                const statusStyle = getStatusBadge(animal.status);
                                const eventStyle = getEventColor(animal.proximo_evento?.color);

                                return (
                                    <div
                                        key={animal.id}
                                        className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {/* Image with Status Badge */}
                                        <div className="relative h-64 bg-slate-100">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center"
                                                style={{ backgroundImage: `url(${animal.foto})` }}
                                            />
                                            <div className="absolute top-3 right-3">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text} shadow-sm`}>
                                                    <span>{statusStyle.icon}</span>
                                                    {animal.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-4">
                                            {/* Name */}
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">{animal.nome}</h3>

                                            {/* Microchip */}
                                            <p className="text-xs text-slate-500 mb-3">MC: {animal.microchip}</p>

                                            {/* Color and Sex */}
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`size-3 rounded-full ${getColorIndicator(animal.cor)}`}></span>
                                                    <span className="text-sm text-slate-700">{animal.cor}</span>
                                                </div>
                                                <div className={`flex items-center gap-1 text-sm font-semibold ${animal.sexo === 'Macho' ? 'text-blue-600' : 'text-pink-600'}`}>
                                                    <span className="material-symbols-outlined text-[16px]">
                                                        {animal.sexo === 'Macho' ? 'male' : 'female'}
                                                    </span>
                                                    <span>{animal.sexo}</span>
                                                </div>
                                            </div>

                                            {/* Age */}
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="material-symbols-outlined text-slate-400 text-[18px]">cake</span>
                                                <span className="text-sm text-slate-700">
                                                    {calculateAge(animal.data_nascimento)} <span className="text-slate-500">{formatDate(animal.data_nascimento)}</span>
                                                </span>
                                            </div>

                                            {/* Next Event */}
                                            {animal.proximo_evento && (
                                                <div className={`flex items-center gap-2 p-3 ${eventStyle.bg} rounded-lg mb-4`}>
                                                    <span className={`material-symbols-outlined text-[20px] ${eventStyle.icon}`}>
                                                        {animal.proximo_evento.icon}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs font-bold ${eventStyle.text} truncate`}>
                                                            {animal.proximo_evento.tipo}
                                                        </p>
                                                        <p className={`text-xs ${eventStyle.text}`}>
                                                            {animal.proximo_evento.data}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/plantel/${animal.id}`)}
                                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-semibold"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                    <span>Perfil</span>
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/plantel/editar/${animal.id}`)}
                                                    className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-sm text-slate-600">
                                    Mostrando <span className="font-semibold">{startIndex + 1}</span> a <span className="font-semibold">{Math.min(endIndex, filteredAnimals.length)}</span> de <span className="font-semibold">{filteredAnimals.length}</span> cães
                                </p>
                                <div className="flex gap-1">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-lg transition-colors ${currentPage === 1
                                                ? 'text-slate-300 cursor-not-allowed'
                                                : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                    </button>

                                    {/* Page Numbers */}
                                    {getPageNumbers().map((page, index) => (
                                        page === '...' ? (
                                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-400 text-sm">
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${currentPage === page
                                                        ? 'bg-primary text-white'
                                                        : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}

                                    {/* Next Button */}
                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-lg transition-colors ${currentPage === totalPages
                                                ? 'text-slate-300 cursor-not-allowed'
                                                : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Show total when only 1 page */}
                        {totalPages <= 1 && filteredAnimals.length > 0 && (
                            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                                <p className="text-sm text-slate-600">
                                    Total: <span className="font-semibold">{filteredAnimals.length}</span> {filteredAnimals.length === 1 ? 'cão' : 'cães'}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default PlantelList;
