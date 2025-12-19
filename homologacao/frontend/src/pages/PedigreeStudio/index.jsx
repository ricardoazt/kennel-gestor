import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import PedigreeTree from '../../components/PedigreeTree';

function PedigreeStudio() {
    const [animals, setAnimals] = useState([]);
    const [selectedAnimalId, setSelectedAnimalId] = useState('');
    const [lineage, setLineage] = useState(null);
    const [bgImage, setBgImage] = useState(null);

    const printRef = useRef();

    useEffect(() => {
        loadAnimals();
    }, []);

    useEffect(() => {
        if (selectedAnimalId) {
            loadLineage(selectedAnimalId);
        }
    }, [selectedAnimalId]);

    async function loadAnimals() {
        try {
            const response = await api.get('/animals');
            setAnimals(response.data);
        } catch (error) {
            console.error('Erro ao carregar animais:', error);
        }
    }

    async function loadLineage(id) {
        try {
            const response = await api.get(`/animals/${id}/lineage?depth=3`);
            setLineage(response.data);
        } catch (error) {
            console.error('Erro ao carregar linhagem:', error);
        }
    }

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => setBgImage(ev.target.result);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handlePrint = () => {
        const content = printRef.current.innerHTML;
        const win = window.open('', '', 'height=700,width=1000');
        win.document.write('<html><head><title>Pedigree</title>');
        // Minimal reset styles
        win.document.write('<style>body { font-family: sans-serif; -webkit-print-color-adjust: exact; }</style>');
        win.document.write('</head><body>');
        win.document.write(content);
        win.document.write('</body></html>');
        win.document.close();
        win.print();
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Estúdio de Design de Pedigree</h1>

            <div className="flex gap-4 mb-6 print:hidden">
                <div className="w-1/3">
                    <label className="block text-sm font-medium mb-1">Selecionar Animal</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={selectedAnimalId}
                        onChange={(e) => setSelectedAnimalId(e.target.value)}
                    >
                        <option value="">-- Selecione --</option>
                        {animals.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                    </select>
                </div>
                <div className="w-1/3">
                    <label className="block text-sm font-medium mb-1">Fundo Personalizado</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm border p-1 rounded" />
                </div>
                <div className="w-1/3 flex items-end">
                    <button
                        onClick={handlePrint}
                        disabled={!lineage}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 w-full"
                    >
                        Imprimir / Gerar PDF
                    </button>
                </div>
            </div>

            <div className="border border-gray-300 p-4 bg-gray-100 overflow-auto">
                <div
                    ref={printRef}
                    className="relative bg-white shadow-lg mx-auto"
                    style={{
                        width: '1122px', // A4 Landscape roughly at 96dpi
                        height: '793px',
                        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    {!bgImage && <div className="absolute inset-0 flex text-gray-200 text-6xl font-bold justify-center items-center select-none uppercase z-0">Layout Padrão</div>}

                    <div className="relative z-10 p-10 h-full flex flex-col justify-between" style={{ backgroundColor: bgImage ? 'rgba(255,255,255,0.3)' : 'transparent' }}>
                        <div className="text-center">
                            <h2 className="text-4xl font-serif text-gray-800">{lineage ? lineage.nome : 'Nome do Cão'}</h2>
                            <p className="text-xl text-gray-600 mt-2">{lineage ? lineage.registro : 'Registro #00000'}</p>
                        </div>

                        <div className="flex-1 flex items-center justify-center">
                            {lineage ? <PedigreeTree lineage={lineage} /> : <p className="text-center text-gray-500">Selecione um animal para visualizar</p>}
                        </div>

                        <div className="text-center text-sm text-gray-500 mt-4 border-t pt-4">
                            Emitido por Kennel Gestor
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PedigreeStudio;
