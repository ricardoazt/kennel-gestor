import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function PlantelProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('health'); // health, reproduction, documents, pedigree
    const [showHealthEventForm, setShowHealthEventForm] = useState(false);
    const [healthEventForm, setHealthEventForm] = useState({
        data: '',
        tipo: 'Vacina',
        descricao: '',
        veterinario: '',
        status: 'Agendado',
        observacoes: ''
    });

    useEffect(() => {
        loadData();
    }, [id]);

    async function loadData() {
        try {
            setLoading(true);
            const response = await api.get(`/animals/${id}`);
            // Enrich with mock data for demo
            const enrichedAnimal = {
                ...response.data,
                microchip: response.data.microchip || `MC${Math.floor(Math.random() * 1000000000)}`,
                cor: response.data.cor || 'Dourado',
                data_nascimento: response.data.data_nascimento || '2020-08-15',
                pedigree: response.data.pedigree || 'CBKC-123456',
                proprietario: response.data.proprietario || 'Canil Central',
                foto: response.data.foto || `https://source.unsplash.com/400x400/?dog,${response.data.id}`,
                peso_atual: response.data.peso_atual || 38.5,
                tipo_sanguineo: response.data.tipo_sanguineo || 'DEA 1.1 Pos',
                displasia_coxofemoral: response.data.displasia_coxofemoral || 'HD - A',
                displasia_cotovelo: response.data.displasia_cotovelo || 'ED - 0',
                dna_profile: response.data.dna_profile || 'Arquivado',
                proxima_vacina: { data: '12 Out 2023', dias: 5 },
                ultima_cruza: { data: '15 Mai 2023', parceira: 'Bella' },
                historico_saude: getMockHealthHistory(),
                historico_cruzas: getMockBreedingHistory(),
                documentos: getMockDocuments(),
                pedigreeData: getMockPedigree(response.data.id)
            };
            setAnimal(enrichedAnimal);
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            // Fallback to mock data
            setAnimal(getMockAnimal(id));
        } finally {
            setLoading(false);
        }
    }

    function getMockAnimal(id) {
        return {
            id,
            nome: 'Rex von Schutzhund',
            sexo: 'Macho',
            raca: 'Pastor Alemão',
            cor: 'Capa Preta',
            data_nascimento: '2020-08-15',
            microchip: '982123456789',
            pedigree: 'CBKC-123456',
            proprietario: 'Canil Central',
            foto: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=400&fit=crop',
            peso_atual: 38.5,
            tipo_sanguineo: 'DEA 1.1 Pos',
            displasia_coxofemoral: 'HD - A',
            displasia_cotovelo: 'ED - 0',
            dna_profile: 'Arquivado',
            proxima_vacina: { data: '12 Out 2023', dias: 5 },
            ultima_cruza: { data: '15 Mai 2023', parceira: 'Bella' },
            historico_saude: getMockHealthHistory(),
            historico_cruzas: getMockBreedingHistory(),
            documentos: getMockDocuments(),
            pedigreeData: getMockPedigree(id)
        };
    }

    function getMockHealthHistory() {
        return [
            { data: '12/10/2023', tipo: 'Vacina', descricao: 'Vanguard HTLP 5/CV-L (Dose 1)', veterinario: 'Dr. Silva', status: 'Agendado', cor: 'blue' },
            { data: '10/08/2023', tipo: 'Vermífugo', descricao: 'Drontal Plus (2 cp)', veterinario: 'Interno', status: 'Concluído', cor: 'purple' },
            { data: '15/05/2023', tipo: 'Consulta', descricao: 'Checkup anual de rotina', veterinario: 'Dra. Costa', status: 'Concluído', cor: 'amber' }
        ];
    }

    function getMockBreedingHistory() {
        return [
            { data: '15/05/2023', parceira: 'Bella do Vale', tipo: 'Natural', resultado: '6 Filhotes' },
            { data: '10/11/2022', parceira: 'Luna Star', tipo: 'Inseminação', resultado: '4 Filhotes' }
        ];
    }

    function getMockDocuments() {
        return [
            { nome: 'Pedigree_Rex.pdf', tamanho: '2.4 MB', data: '10 Ago 2020', tipo: 'pdf' },
            { nome: 'Laudo_Displasia.jpg', tamanho: '1.1 MB', data: '15 Jun 2021', tipo: 'image' },
            { nome: 'Contrato_Compra.pdf', tamanho: '850 KB', data: '15 Ago 2020', tipo: 'pdf' }
        ];
    }

    function getMockPedigree(animalId) {
        // Mock pedigree data - 3 generations
        return {
            pai: {
                id: 101,
                nome: 'Thor von Edelstein',
                registro: 'CBKC-PA-2015-001',
                cor: 'Preto e Dourado',
                foto: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=200&h=200&fit=crop',
                pai: {
                    id: 201,
                    nome: 'Zeus vom Kraftwerk',
                    registro: 'CBKC-PA-2012-045',
                    cor: 'Preto e Dourado',
                    pai: { nome: 'Odin vom Bergland', registro: 'CBKC-PA-2009-023' },
                    mae: { nome: 'Freya vom Bergland', registro: 'CBKC-PA-2010-067' }
                },
                mae: {
                    id: 202,
                    nome: 'Hera vom Edelstein',
                    registro: 'CBKC-PA-2013-089',
                    cor: 'Preto e Marrom',
                    pai: { nome: 'Apollo vom Stern', registro: 'CBKC-PA-2010-034' },
                    mae: { nome: 'Athena vom Stern', registro: 'CBKC-PA-2011-056' }
                }
            },
            mae: {
                id: 102,
                nome: 'Luna vom Waldhaus',
                registro: 'CBKC-PA-2016-078',
                cor: 'Preto e Marrom',
                foto: 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=200&h=200&fit=crop',
                pai: {
                    id: 203,
                    nome: 'Ares vom Kraftwerk',
                    registro: 'CBKC-PA-2013-012',
                    cor: 'Preto e Dourado',
                    pai: { nome: 'Hades vom Bergland', registro: 'CBKC-PA-2010-078' },
                    mae: { nome: 'Persephone vom Berg', registro: 'CBKC-PA-2011-089' }
                },
                mae: {
                    id: 204,
                    nome: 'Diana vom Waldhaus',
                    registro: 'CBKC-PA-2014-045',
                    cor: 'Preto e Marrom',
                    pai: { nome: 'Artemis vom Wald', registro: 'CBKC-PA-2011-023' },
                    mae: { nome: 'Selene vom Wald', registro: 'CBKC-PA-2012-034' }
                }
            }
        };
    }

    function calculateAge(birthDate) {
        const birth = new Date(birthDate);
        const today = new Date();
        const years = today.getFullYear() - birth.getFullYear();
        const months = today.getMonth() - birth.getMonth();

        if (months < 0) {
            return `${years - 1} Anos, ${12 + months} meses`;
        }
        return `${years} Anos, ${months} meses`;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    function getStatusColor(status) {
        const colors = {
            'Agendado': 'text-orange-600',
            'Concluído': 'text-emerald-600'
        };
        return colors[status] || 'text-slate-600';
    }

    function handleHealthEventFormChange(field, value) {
        setHealthEventForm(prev => ({
            ...prev,
            [field]: value
        }));
    }

    function handleHealthEventSubmit(e) {
        e.preventDefault();

        // Format the date for display
        const formattedDate = new Date(healthEventForm.data).toLocaleDateString('pt-BR');

        // Create new health event
        const newEvent = {
            data: formattedDate,
            tipo: healthEventForm.tipo,
            descricao: healthEventForm.descricao,
            veterinario: healthEventForm.veterinario,
            status: healthEventForm.status,
            observacoes: healthEventForm.observacoes
        };

        // Add to animal's health history
        setAnimal(prev => ({
            ...prev,
            historico_saude: [newEvent, ...prev.historico_saude]
        }));

        // Reset form and close modal
        setHealthEventForm({
            data: '',
            tipo: 'Vacina',
            descricao: '',
            veterinario: '',
            status: 'Agendado',
            observacoes: ''
        });
        setShowHealthEventForm(false);

        // TODO: Send to API
        // api.post(`/animals/${id}/health-events`, healthEventForm);
    }

    function handleCancelHealthEventForm() {
        setHealthEventForm({
            data: '',
            tipo: 'Vacina',
            descricao: '',
            veterinario: '',
            status: 'Agendado',
            observacoes: ''
        });
        setShowHealthEventForm(false);
    }

    function getTypeColor(tipo) {
        const colors = {
            'Vacina': { bg: 'bg-blue-100', text: 'text-blue-800' },
            'Vermífugo': { bg: 'bg-purple-100', text: 'text-purple-800' },
            'Consulta': { bg: 'bg-amber-100', text: 'text-amber-800' },
            'Exame': { bg: 'bg-teal-100', text: 'text-teal-800' },
            'Cirurgia': { bg: 'bg-red-100', text: 'text-red-800' },
            'Medicação': { bg: 'bg-green-100', text: 'text-green-800' },
            'Outro': { bg: 'bg-slate-100', text: 'text-slate-800' }
        };
        return colors[tipo] || { bg: 'bg-slate-100', text: 'text-slate-800' };
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-slate-500">Carregando perfil...</div>
            </div>
        );
    }

    if (!animal) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-slate-500">Animal não encontrado.</div>
            </div>
        );
    }

    const age = calculateAge(animal.data_nascimento);

    return (
        <main className="flex-1 overflow-y-auto bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-slate-900">Perfil do Cão</h1>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar cão..."
                                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary w-64"
                                />
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                            </div>
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-slate-600">notifications</span>
                            </button>
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-slate-600">settings</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>›</span>
                        <Link to="/plantel" className="hover:text-primary transition-colors">Cães</Link>
                        <span>›</span>
                        <span className="text-slate-900 font-medium">{animal.nome}</span>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-start gap-6">
                            {/* Dog Photo */}
                            <div className="relative shrink-0">
                                <div
                                    className="size-24 rounded-full border-2 border-slate-200 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${animal.foto})` }}
                                />
                                <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full border-2 border-white" title="Ativo">
                                    <span className="material-symbols-outlined text-[14px] block">check</span>
                                </div>
                            </div>

                            {/* Dog Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-1">{animal.nome}</h2>
                                        <p className="text-slate-600 text-sm mb-2">{animal.raca || 'Pastor Alemão'} • {animal.cor} • {animal.sexo}</p>
                                        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">
                                            ATIVO NO PLANTEL
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/plantel/editar/${id}`}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                            Editar
                                        </Link>
                                        <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">share</span>
                                            Compartilhar
                                        </button>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-4 gap-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-slate-500 uppercase font-medium">DATA DE NASCIMENTO</span>
                                        <span className="text-sm font-semibold text-slate-900">{formatDate(animal.data_nascimento)}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-slate-500 uppercase font-medium">MICROCHIP</span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm font-semibold text-slate-900">{animal.microchip}</span>
                                            <span className="material-symbols-outlined text-blue-500 text-[16px]">verified</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-slate-500 uppercase font-medium">PEDIGREE</span>
                                        <span className="text-sm font-semibold text-primary cursor-pointer hover:underline">{animal.pedigree}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-slate-500 uppercase font-medium">PROPRIETÁRIO</span>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-slate-400 text-[16px]">home</span>
                                            <span className="text-sm font-semibold text-slate-900">{animal.proprietario}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-4">
                        {/* Próxima Vacina */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-xs text-slate-500 uppercase font-medium">PRÓXIMA VACINA</span>
                                <span className="material-symbols-outlined text-orange-500 text-[20px]">vaccines</span>
                            </div>
                            <div className="text-xl font-bold text-orange-600 mb-1">{animal.proxima_vacina.data}</div>
                            <div className="text-xs text-slate-600">Vence em {animal.proxima_vacina.dias} dias</div>
                        </div>

                        {/* Última Cruza */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-xs text-slate-500 uppercase font-medium">ÚLTIMA CRUZA</span>
                                <span className="material-symbols-outlined text-pink-500 text-[20px]">favorite</span>
                            </div>
                            <div className="text-xl font-bold text-slate-900 mb-1">{animal.ultima_cruza.data}</div>
                            <div className="text-xs text-slate-600">Parceira: {animal.ultima_cruza.parceira}</div>
                        </div>

                        {/* Idade */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-xs text-slate-500 uppercase font-medium">IDADE</span>
                                <span className="material-symbols-outlined text-purple-500 text-[20px]">cake</span>
                            </div>
                            <div className="text-xl font-bold text-slate-900 mb-1">{age.split(',')[0]}</div>
                            <div className="text-xs text-slate-600">{age.split(',')[1]}</div>
                        </div>

                        {/* Peso Atual */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-xs text-slate-500 uppercase font-medium">PESO ATUAL</span>
                                <span className="material-symbols-outlined text-emerald-500 text-[20px]">monitor_weight</span>
                            </div>
                            <div className="text-xl font-bold text-slate-900 mb-1">{animal.peso_atual} kg</div>
                            <div className="text-xs text-emerald-600 flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                +0.5kg
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-t-xl border border-slate-200 border-b-0">
                        <nav className="px-6 flex space-x-8 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('health')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm font-semibold flex items-center gap-2 ${activeTab === 'health'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">medical_services</span>
                                Saúde e Agenda
                            </button>
                            <button
                                onClick={() => setActiveTab('reproduction')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium flex items-center gap-2 ${activeTab === 'reproduction'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">transgender</span>
                                Reprodução
                            </button>
                            <button
                                onClick={() => setActiveTab('documents')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium flex items-center gap-2 ${activeTab === 'documents'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">folder</span>
                                Documentos e Averbo
                            </button>
                            <button
                                onClick={() => setActiveTab('pedigree')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium flex items-center gap-2 ${activeTab === 'pedigree'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">account_tree</span>
                                Árvore Genealógica
                            </button>
                        </nav>
                    </div>

                    {/* Content Grid */}
                    <div className={`grid gap-6 pb-10 ${activeTab === 'documents' ? 'grid-cols-1 xl:grid-cols-3' : 'grid-cols-1'}`}>
                        {/* Main Left Column */}
                        <div className={activeTab === 'documents' ? 'xl:col-span-2 space-y-6' : 'space-y-6'}>
                            {/* Health Section */}
                            {activeTab === 'health' && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">medical_services</span>
                                            Histórico de Saúde
                                        </h3>
                                        <button
                                            onClick={() => setShowHealthEventForm(true)}
                                            className="text-primary text-sm font-semibold hover:underline"
                                        >
                                            + Adicionar Evento
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-slate-600">
                                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                                <tr>
                                                    <th className="px-6 py-3">Data</th>
                                                    <th className="px-6 py-3">Tipo</th>
                                                    <th className="px-6 py-3">Descrição</th>
                                                    <th className="px-6 py-3">Veterinário</th>
                                                    <th className="px-6 py-3">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {animal.historico_saude.map((item, index) => {
                                                    const typeStyle = getTypeColor(item.tipo);
                                                    return (
                                                        <tr key={index} className="bg-white border-b hover:bg-slate-50">
                                                            <td className="px-6 py-4 font-medium">{item.data}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`${typeStyle.bg} ${typeStyle.text} text-xs px-2 py-0.5 rounded`}>
                                                                    {item.tipo}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">{item.descricao}</td>
                                                            <td className="px-6 py-4">{item.veterinario}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`${getStatusColor(item.status)} font-semibold text-xs`}>
                                                                    {item.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Reproduction Section */}
                            {activeTab === 'reproduction' && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">genetics</span>
                                            Dados Reprodutivos
                                        </h3>
                                        <button className="text-primary text-sm font-semibold hover:underline">Gerenciar</button>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                <p className="text-xs text-slate-500 uppercase font-semibold">Tipo Sanguíneo</p>
                                                <p className="text-lg font-bold text-slate-900">{animal.tipo_sanguineo}</p>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                <p className="text-xs text-slate-500 uppercase font-semibold">Displasia Coxofemoral</p>
                                                <p className="text-lg font-bold text-slate-900">{animal.displasia_coxofemoral}</p>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                <p className="text-xs text-slate-500 uppercase font-semibold">Displasia Cotovelo</p>
                                                <p className="text-lg font-bold text-slate-900">{animal.displasia_cotovelo}</p>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                <p className="text-xs text-slate-500 uppercase font-semibold">DNA Profile</p>
                                                <p className="text-lg font-bold text-emerald-600 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">verified</span> {animal.dna_profile}
                                                </p>
                                            </div>
                                        </div>

                                        <h4 className="text-sm font-semibold text-slate-900 mb-3">Histórico de Cruzas Recentes</h4>
                                        <div className="rounded-lg border border-slate-200 overflow-hidden">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
                                                    <tr>
                                                        <th className="px-4 py-2">Data</th>
                                                        <th className="px-4 py-2">Parceira</th>
                                                        <th className="px-4 py-2">Tipo</th>
                                                        <th className="px-4 py-2 text-right">Resultado</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {animal.historico_cruzas.map((item, index) => (
                                                        <tr key={index} className="hover:bg-slate-50">
                                                            <td className="px-4 py-3 text-slate-900">{item.data}</td>
                                                            <td className="px-4 py-3 text-primary">{item.parceira}</td>
                                                            <td className="px-4 py-3 text-slate-500">{item.tipo}</td>
                                                            <td className="px-4 py-3 text-right">
                                                                <span className="text-emerald-600 font-medium">{item.resultado}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Pedigree Section */}
                            {activeTab === 'pedigree' && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">account_tree</span>
                                            Árvore Genealógica - 3 Gerações
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">Linhagem completa com pais, avós e bisavós</p>
                                    </div>
                                    <div className="p-6 overflow-x-auto">
                                        {/* Pedigree Tree */}
                                        <div className="min-w-[800px]">
                                            {/* Current Dog */}
                                            <div className="flex items-center justify-center mb-8">
                                                <div className="bg-gradient-to-br from-primary to-blue-600 text-white p-6 rounded-xl shadow-lg max-w-xs w-full">
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            className="size-16 rounded-full border-4 border-white shadow-md bg-cover bg-center shrink-0"
                                                            style={{ backgroundImage: `url(${animal.foto})` }}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-lg truncate">{animal.nome}</h4>
                                                            <p className="text-xs opacity-90 truncate">{animal.pedigree}</p>
                                                            <p className="text-xs opacity-75 mt-1">{animal.cor}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Parents Level */}
                                            <div className="grid grid-cols-2 gap-6 mb-6">
                                                {/* Father */}
                                                {animal.pedigreeData?.pai && (
                                                    <div className="space-y-4">
                                                        <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <div
                                                                    className="size-12 rounded-full border-2 border-blue-300 bg-cover bg-center shrink-0"
                                                                    style={{ backgroundImage: `url(${animal.pedigreeData.pai.foto})` }}
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="material-symbols-outlined text-blue-600 text-sm">male</span>
                                                                        <span className="text-xs font-semibold text-blue-600 uppercase">Pai</span>
                                                                    </div>
                                                                    <h5 className="font-bold text-slate-900 truncate">{animal.pedigreeData.pai.nome}</h5>
                                                                    <p className="text-xs text-slate-600 truncate">{animal.pedigreeData.pai.registro}</p>
                                                                </div>
                                                            </div>

                                                            {/* Paternal Grandparents */}
                                                            <div className="space-y-2 pl-2 border-l-2 border-blue-200">
                                                                {animal.pedigreeData.pai.pai && (
                                                                    <div className="bg-white p-3 rounded border border-blue-100 ml-2">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className="material-symbols-outlined text-blue-500 text-xs">male</span>
                                                                            <span className="text-xs font-semibold text-blue-500">Avô Paterno</span>
                                                                        </div>
                                                                        <p className="text-sm font-bold text-slate-800 truncate">{animal.pedigreeData.pai.pai.nome}</p>
                                                                        <p className="text-xs text-slate-500 truncate">{animal.pedigreeData.pai.pai.registro}</p>

                                                                        {/* Great-grandparents */}
                                                                        {(animal.pedigreeData.pai.pai.pai || animal.pedigreeData.pai.pai.mae) && (
                                                                            <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                                                                                {animal.pedigreeData.pai.pai.pai && (
                                                                                    <p className="text-xs text-slate-600 truncate">↳ {animal.pedigreeData.pai.pai.pai.nome}</p>
                                                                                )}
                                                                                {animal.pedigreeData.pai.pai.mae && (
                                                                                    <p className="text-xs text-slate-600 truncate">↳ {animal.pedigreeData.pai.pai.mae.nome}</p>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {animal.pedigreeData.pai.mae && (
                                                                    <div className="bg-white p-3 rounded border border-pink-100 ml-2">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className="material-symbols-outlined text-pink-500 text-xs">female</span>
                                                                            <span className="text-xs font-semibold text-pink-500">Avó Paterna</span>
                                                                        </div>
                                                                        <p className="text-sm font-bold text-slate-800 truncate">{animal.pedigreeData.pai.mae.nome}</p>
                                                                        <p className="text-xs text-slate-500 truncate">{animal.pedigreeData.pai.mae.registro}</p>

                                                                        {/* Great-grandparents */}
                                                                        {(animal.pedigreeData.pai.mae.pai || animal.pedigreeData.pai.mae.mae) && (
                                                                            <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                                                                                {animal.pedigreeData.pai.mae.pai && (
                                                                                    <p className="text-xs text-slate-600 truncate">↳ {animal.pedigreeData.pai.mae.pai.nome}</p>
                                                                                )}
                                                                                {animal.pedigreeData.pai.mae.mae && (
                                                                                    <p className="text-xs text-slate-600 truncate">↳ {animal.pedigreeData.pai.mae.mae.nome}</p>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Mother */}
                                                {animal.pedigreeData?.mae && (
                                                    <div className="space-y-4">
                                                        <div className="bg-pink-50 border-2 border-pink-200 p-4 rounded-lg">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <div
                                                                    className="size-12 rounded-full border-2 border-pink-300 bg-cover bg-center shrink-0"
                                                                    style={{ backgroundImage: `url(${animal.pedigreeData.mae.foto})` }}
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="material-symbols-outlined text-pink-600 text-sm">female</span>
                                                                        <span className="text-xs font-semibold text-pink-600 uppercase">Mãe</span>
                                                                    </div>
                                                                    <h5 className="font-bold text-slate-900 truncate">{animal.pedigreeData.mae.nome}</h5>
                                                                    <p className="text-xs text-slate-600 truncate">{animal.pedigreeData.mae.registro}</p>
                                                                </div>
                                                            </div>

                                                            {/* Maternal Grandparents */}
                                                            <div className="space-y-2 pl-2 border-l-2 border-pink-200">
                                                                {animal.pedigreeData.mae.pai && (
                                                                    <div className="bg-white p-3 rounded border border-blue-100 ml-2">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className="material-symbols-outlined text-blue-500 text-xs">male</span>
                                                                            <span className="text-xs font-semibold text-blue-500">Avô Materno</span>
                                                                        </div>
                                                                        <p className="text-sm font-bold text-slate-800 truncate">{animal.pedigreeData.mae.pai.nome}</p>
                                                                        <p className="text-xs text-slate-500 truncate">{animal.pedigreeData.mae.pai.registro}</p>

                                                                        {/* Great-grandparents */}
                                                                        {(animal.pedigreeData.mae.pai.pai || animal.pedigreeData.mae.pai.mae) && (
                                                                            <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                                                                                {animal.pedigreeData.mae.pai.pai && (
                                                                                    <p className="text-xs text-slate-600 truncate">↳ {animal.pedigreeData.mae.pai.pai.nome}</p>
                                                                                )}
                                                                                {animal.pedigreeData.mae.pai.mae && (
                                                                                    <p className="text-xs text-slate-600 truncate">↳ {animal.pedigreeData.mae.pai.mae.nome}</p>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {animal.pedigreeData.mae.mae && (
                                                                    <div className="bg-white p-3 rounded border border-pink-100 ml-2">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className="material-symbols-outlined text-pink-500 text-xs">female</span>
                                                                            <span className="text-xs font-semibold text-pink-500">Avó Materna</span>
                                                                        </div>
                                                                        <p className="text-sm font-bold text-slate-800 truncate">{animal.pedigreeData.mae.mae.nome}</p>
                                                                        <p className="text-xs text-slate-500 truncate">{animal.pedigreeData.mae.mae.registro}</p>

                                                                        {/* Great-grandparents */}
                                                                        {(animal.pedigreeData.mae.mae.pai || animal.pedigreeData.mae.mae.mae) && (
                                                                            <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                                                                                {animal.pedigreeData.mae.mae.pai && (
                                                                                    <p className="text-xs text-slate-600 truncate">↳ {animal.pedigreeData.mae.mae.pai.nome}</p>
                                                                                )}
                                                                                {animal.pedigreeData.mae.mae.mae && (
                                                                                    <p className="text-xs text-slate-600 truncate">↳ {animal.pedigreeData.mae.mae.mae.nome}</p>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Legend */}
                                            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                                <h4 className="text-sm font-semibold text-slate-700 mb-2">Legenda</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-4 bg-gradient-to-br from-primary to-blue-600 rounded"></div>
                                                        <span className="text-slate-600">Cão Atual</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-4 bg-blue-100 border border-blue-200 rounded"></div>
                                                        <span className="text-slate-600">Linhagem Paterna</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-4 bg-pink-100 border border-pink-200 rounded"></div>
                                                        <span className="text-slate-600">Linhagem Materna</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-slate-400 text-sm">account_tree</span>
                                                        <span className="text-slate-600">3 Gerações</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Documents Section */}
                            {activeTab === 'documents' && (
                                <div className="space-y-6">
                                    {/* Documents Upload */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">folder_open</span>
                                                Documentos
                                            </h3>
                                        </div>
                                        <div className="p-6">
                                            {/* Dropzone */}
                                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer mb-6 group">
                                                <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-primary transition-colors">cloud_upload</span>
                                                <p className="mt-2 text-sm text-slate-600">
                                                    Arraste arquivos aqui ou <span className="text-primary font-medium">clique para selecionar</span>
                                                </p>
                                            </div>

                                            {/* Files List */}
                                            <div className="space-y-3">
                                                {animal.documentos.map((doc, index) => (
                                                    <div key={index} className="flex items-center p-3 rounded-lg border border-slate-200 hover:shadow-md transition-shadow bg-slate-50 group">
                                                        <div className={`size-10 rounded flex items-center justify-center shrink-0 ${doc.tipo === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                                            }`}>
                                                            <span className="material-symbols-outlined">
                                                                {doc.tipo === 'pdf' ? 'picture_as_pdf' : 'image'}
                                                            </span>
                                                        </div>
                                                        <div className="ml-3 flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-slate-900 truncate">{doc.nome}</p>
                                                            <p className="text-xs text-slate-500">{doc.tamanho} • {doc.data}</p>
                                                        </div>
                                                        <button className="text-slate-400 hover:text-primary p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="material-symbols-outlined">download</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes (Averbo) */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col">
                                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">edit_note</span>
                                                Averbo / Notas
                                            </h3>
                                        </div>
                                        <div className="p-4 flex-1">
                                            <textarea
                                                className="w-full h-full min-h-[150px] p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-slate-700 text-sm focus:ring-2 focus:ring-primary/50 resize-none placeholder:text-slate-400"
                                                placeholder="Digite observações importantes sobre comportamento, alimentação ou manejo..."
                                            />
                                            <div className="flex justify-end mt-2">
                                                <button className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-semibold rounded hover:bg-slate-300 transition-colors">
                                                    Salvar Nota
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Empty when documents tab is not active */}
                        <div className="flex flex-col gap-6">
                            {/* This column is now empty - content moved to tabs */}
                        </div>
                    </div>

                    {/* Health Event Form Modal */}
                    {showHealthEventForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                {/* Modal Header */}
                                <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-primary to-blue-600 text-white sticky top-0 z-10">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <span className="material-symbols-outlined">add_circle</span>
                                            Adicionar Evento de Saúde
                                        </h2>
                                        <button
                                            onClick={handleCancelHealthEventForm}
                                            className="text-white/80 hover:text-white transition-colors"
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    </div>
                                    <p className="text-sm text-white/90 mt-1">Registre vacinas, consultas, vermífugos e outros eventos</p>
                                </div>

                                {/* Modal Body */}
                                <form onSubmit={handleHealthEventSubmit} className="p-6 space-y-5">
                                    {/* Date and Type Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Date */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Data do Evento <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={healthEventForm.data}
                                                onChange={(e) => handleHealthEventFormChange('data', e.target.value)}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                            />
                                        </div>

                                        {/* Type */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Tipo de Evento <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={healthEventForm.tipo}
                                                onChange={(e) => handleHealthEventFormChange('tipo', e.target.value)}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors bg-white"
                                            >
                                                <option value="Vacina">Vacina</option>
                                                <option value="Vermífugo">Vermífugo</option>
                                                <option value="Consulta">Consulta</option>
                                                <option value="Exame">Exame</option>
                                                <option value="Cirurgia">Cirurgia</option>
                                                <option value="Medicação">Medicação</option>
                                                <option value="Outro">Outro</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Descrição <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={healthEventForm.descricao}
                                            onChange={(e) => handleHealthEventFormChange('descricao', e.target.value)}
                                            placeholder="Ex: Vanguard HTLP 5/CV-L (Dose 1)"
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Descreva o procedimento, medicamento ou motivo da consulta</p>
                                    </div>

                                    {/* Veterinarian and Status Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Veterinarian */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Responsável
                                            </label>
                                            <select
                                                value={healthEventForm.veterinario}
                                                onChange={(e) => handleHealthEventFormChange('veterinario', e.target.value)}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors bg-white"
                                            >
                                                <option value="">Selecione...</option>
                                                <option value="Interno">Interno/Canil</option>
                                                <option value="Dr. Silva">Dr. Silva</option>
                                                <option value="Dra. Costa">Dra. Costa</option>
                                                <option value="Dr. João Silva">Dr. João Silva</option>
                                                <option value="Dra. Maria Santos">Dra. Maria Santos</option>
                                                <option value="Clínica VetCenter">Clínica VetCenter</option>
                                            </select>
                                            <p className="text-xs text-slate-500 mt-1">Quem aplicou ou realizou o procedimento</p>
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Status <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={healthEventForm.status}
                                                onChange={(e) => handleHealthEventFormChange('status', e.target.value)}
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors bg-white"
                                            >
                                                <option value="Agendado">Agendado</option>
                                                <option value="Concluído">Concluído</option>
                                                <option value="Cancelado">Cancelado</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Observations */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Observações
                                        </label>
                                        <textarea
                                            value={healthEventForm.observacoes}
                                            onChange={(e) => handleHealthEventFormChange('observacoes', e.target.value)}
                                            placeholder="Adicione observações adicionais sobre o evento (opcional)"
                                            rows="3"
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                                        />
                                    </div>

                                    {/* Info Alert */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                                        <span className="material-symbols-outlined text-blue-600 text-xl shrink-0">info</span>
                                        <div className="text-sm text-blue-800">
                                            <p className="font-semibold mb-1">Dica:</p>
                                            <p>Mantenha o histórico de saúde sempre atualizado para facilitar o acompanhamento veterinário e garantir que todas as vacinas e tratamentos estejam em dia.</p>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                                        <button
                                            type="button"
                                            onClick={handleCancelHealthEventForm}
                                            className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2.5 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                            Adicionar Evento
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default PlantelProfile;
