import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function PlantelProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('health'); // health, reproduction, documents

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
                documentos: getMockDocuments()
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
            documentos: getMockDocuments()
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

    function getTypeColor(tipo) {
        const colors = {
            'Vacina': { bg: 'bg-blue-100', text: 'text-blue-800' },
            'Vermífugo': { bg: 'bg-purple-100', text: 'text-purple-800' },
            'Consulta': { bg: 'bg-amber-100', text: 'text-amber-800' }
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
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <Link to="/plantel" className="hover:text-primary transition-colors">Cães</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="text-slate-900 font-medium">{animal.nome}</span>
                </div>

                {/* Profile Header Card */}
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 relative overflow-hidden group">
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row gap-6 md:items-start relative z-10">
                        {/* Image */}
                        <div className="relative shrink-0 mx-auto md:mx-0">
                            <div
                                className="size-32 md:size-40 rounded-full border-4 border-white shadow-md bg-cover bg-center"
                                style={{ backgroundImage: `url(${animal.foto})` }}
                            />
                            <div className="absolute bottom-2 right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm" title="Ativo">
                                <span className="material-symbols-outlined text-sm block">check</span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2 justify-center md:justify-start">
                                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{animal.nome}</h1>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 self-center">
                                        Ativo no Plantel
                                    </span>
                                </div>
                                <p className="text-slate-500 text-base">{animal.raca || 'Raça não informada'} • {animal.cor} • {animal.sexo}</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-2">
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Data Nasc.</span>
                                    <span className="text-slate-900 font-medium">{formatDate(animal.data_nascimento)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Microchip</span>
                                    <span className="text-slate-900 font-medium">{animal.microchip}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Pedigree</span>
                                    <span className="text-slate-900 font-medium text-primary cursor-pointer hover:underline">{animal.pedigree}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Proprietário</span>
                                    <span className="text-slate-900 font-medium">{animal.proprietario}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex md:flex-col gap-3 justify-center md:justify-start w-full md:w-auto mt-4 md:mt-0">
                            <Link
                                to={`/plantel/editar/${id}`}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
                            >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                <span>Editar Perfil</span>
                            </Link>
                            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">share</span>
                                <span>Compartilhar</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Quick Stats Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500 text-sm font-medium">Próxima Vacina</span>
                            <span className="text-xl font-bold text-orange-600">{animal.proxima_vacina.data}</span>
                            <span className="text-xs text-orange-600/80 bg-orange-50 px-2 py-0.5 rounded w-fit mt-1">
                                Vence em {animal.proxima_vacina.dias} dias
                            </span>
                        </div>
                        <div className="size-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                            <span className="material-symbols-outlined">vaccines</span>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500 text-sm font-medium">Última Cruza</span>
                            <span className="text-xl font-bold text-slate-900">{animal.ultima_cruza.data}</span>
                            <span className="text-xs text-slate-500 mt-1">Parceira: {animal.ultima_cruza.parceira}</span>
                        </div>
                        <div className="size-10 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
                            <span className="material-symbols-outlined">favorite</span>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500 text-sm font-medium">Idade</span>
                            <span className="text-xl font-bold text-slate-900">{age.split(',')[0]}</span>
                            <span className="text-xs text-slate-500 mt-1">{age.split(',')[1]}</span>
                        </div>
                        <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <span className="material-symbols-outlined">cake</span>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500 text-sm font-medium">Peso Atual</span>
                            <span className="text-xl font-bold text-slate-900">{animal.peso_atual} kg</span>
                            <span className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-medium">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span> +0.5kg
                            </span>
                        </div>
                        <div className="size-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <span className="material-symbols-outlined">monitor_weight</span>
                        </div>
                    </div>
                </section>

                {/* Tabs Header */}
                <div className="border-b border-slate-200">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto">
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
                    </nav>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-10">
                    {/* Main Left Column */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Health Section */}
                        {activeTab === 'health' && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">medical_services</span>
                                        Histórico de Saúde
                                    </h3>
                                    <button className="text-primary text-sm font-semibold hover:underline">+ Adicionar Evento</button>
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

                        {/* Documents Section (shown in right column on desktop) */}
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6">
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
                </div>
            </div>
        </main>
    );
}

export default PlantelProfile;
