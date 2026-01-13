import React from 'react';

const Gestacao = () => {
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-gray-900 text-2xl font-bold">Gestação e Pré-parto</h1>
                    <p className="text-gray-600">Acompanhamento de ultrassons e curvas de temperatura.</p>
                </div>
            </div>

            <div className="table-container">
                <p className="p-6 text-gray-500 text-center">Módulo em desenvolvimento</p>
            </div>
        </div>
    );
};

export default Gestacao;
