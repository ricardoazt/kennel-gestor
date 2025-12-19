function PedigreeNode({ animal, level }) {
    if (!animal) return <div className="border p-2 rounded bg-gray-100 text-xs shadow-sm">Desconhecido</div>;

    return (
        <div className="flex flex-col items-center">
            <div className={`border p-2 rounded shadow-sm flex flex-col items-center justify-center text-center bg-white ${level === 0 ? 'border-blue-500 border-2' : 'border-gray-300'}`}>
                <span className="font-bold text-sm block">{animal.nome}</span>
                {animal.registro && <span className="text-xs text-gray-500">{animal.registro}</span>}
            </div>

            {(animal.Pai || animal.Mae) && (
                <div className="flex mt-4 space-x-4 relative">
                    {/* Connecting lines could be improved with SVG or CSS pseudo-elements */}
                    <div className="flex flex-col items-center">
                        <div className="text-xs text-gray-400 mb-1">Pai</div>
                        <PedigreeNode animal={animal.Pai} level={level + 1} />
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-xs text-gray-400 mb-1">Mãe</div>
                        <PedigreeNode animal={animal.Mae} level={level + 1} />
                    </div>
                </div>
            )}
        </div>
    );
}

function PedigreeTree({ lineage }) {
    if (!lineage) return <div>Carregando linhagem...</div>;

    return (
        <div className="overflow-auto p-4 border rounded bg-gray-50 flex justify-center min-h-[400px]">
            <PedigreeNode animal={lineage} level={0} />
        </div>
    );
}

export default PedigreeTree;
