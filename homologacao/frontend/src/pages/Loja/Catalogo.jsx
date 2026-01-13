import React from 'react';

const Catalogo = () => {
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-gray-900 text-2xl font-bold">Catálogo de Produtos</h1>
                    <p className="text-gray-600">Acessórios, ração e kits filhote.</p>
                </div>
                <button className="btn-primary">
                    <span className="material-symbols-outlined">add</span>
                    <span>Novo Produto</span>
                </button>
            </div>

            <div className="table-container">
                <p className="p-6 text-gray-500 text-center">Módulo em desenvolvimento</p>
            </div>
        </div>
    );
};

export default Catalogo;
