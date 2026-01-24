import React from 'react';

// Comprehensive color palette with 65 colors covering all tones
const COLLAR_COLORS = [
    // Reds
    { name: 'Vermelho', color: '#EF4444', icon: '🔴' },
    { name: 'Vermelho Escuro', color: '#991B1B', icon: '🔴' },
    { name: 'Vermelho Claro', color: '#FCA5A5', icon: '🔴' },
    { name: 'Vinho', color: '#881337', icon: '🔴' },
    { name: 'Carmim', color: '#DC2626', icon: '🔴' },

    // Pinks
    { name: 'Rosa', color: '#EC4899', icon: '💗' },
    { name: 'Rosa Claro', color: '#F9A8D4', icon: '💗' },
    { name: 'Rosa Escuro', color: '#BE185D', icon: '💗' },
    { name: 'Rosa Bebê', color: '#FBE0E7', icon: '💗' },
    { name: 'Magenta', color: '#DB2777', icon: '💗' },

    // Oranges
    { name: 'Laranja', color: '#F97316', icon: '🟠' },
    { name: 'Laranja Escuro', color: '#C2410C', icon: '🟠' },
    { name: 'Laranja Claro', color: '#FDBA74', icon: '🟠' },
    { name: 'Coral', color: '#F87171', icon: '🟠' },
    { name: 'Pêssego', color: '#FDBA74', icon: '🟠' },
    { name: 'Tangerina', color: '#FB923C', icon: '🟠' },

    // Yellows
    { name: 'Amarelo', color: '#F59E0B', icon: '🟡' },
    { name: 'Amarelo Claro', color: '#FDE047', icon: '🟡' },
    { name: 'Amarelo Escuro', color: '#CA8A04', icon: '🟡' },
    { name: 'Dourado', color: '#D97706', icon: '🟡' },
    { name: 'Ouro', color: '#EAB308', icon: '🟡' },
    { name: 'Âmbar', color: '#F59E0B', icon: '🟡' },

    // Greens
    { name: 'Verde', color: '#10B981', icon: '🟢' },
    { name: 'Verde Escuro', color: '#065F46', icon: '🟢' },
    { name: 'Verde Claro', color: '#6EE7B7', icon: '🟢' },
    { name: 'Limão', color: '#84CC16', icon: '🟢' },
    { name: 'Lima', color: '#A3E635', icon: '🟢' },
    { name: 'Menta', color: '#6EE7B7', icon: '🟢' },
    { name: 'Esmeralda', color: '#059669', icon: '🟢' },
    { name: 'Verde Oliva', color: '#65A30D', icon: '🟢' },
    { name: 'Verde Musgo', color: '#4D7C0F', icon: '🟢' },

    // Teals & Cyans
    { name: 'Turquesa', color: '#14B8A6', icon: '🔷' },
    { name: 'Ciano', color: '#06B6D4', icon: '🔷' },
    { name: 'Água', color: '#22D3EE', icon: '🔷' },
    { name: 'Verde-Água', color: '#5EEAD4', icon: '🔷' },

    // Blues
    { name: 'Azul', color: '#3B82F6', icon: '🔵' },
    { name: 'Azul Escuro', color: '#1E3A8A', icon: '🔵' },
    { name: 'Azul Claro', color: '#93C5FD', icon: '🔵' },
    { name: 'Navy', color: '#1E40AF', icon: '🔵' },
    { name: 'Azul Royal', color: '#2563EB', icon: '🔵' },
    { name: 'Azul Céu', color: '#7DD3FC', icon: '🔵' },
    { name: 'Azul Marinho', color: '#0C4A6E', icon: '🔵' },

    // Purples
    { name: 'Roxo', color: '#8B5CF6', icon: '🟣' },
    { name: 'Roxo Escuro', color: '#5B21B6', icon: '🟣' },
    { name: 'Roxo Claro', color: '#C4B5FD', icon: '🟣' },
    { name: 'Violeta', color: '#7C3AED', icon: '🟣' },
    { name: 'Lavanda', color: '#A78BFA', icon: '🟣' },
    { name: 'Lilás', color: '#C084FC', icon: '🟣' },
    { name: 'Púrpura', color: '#A855F7', icon: '🟣' },
    { name: 'Índigo', color: '#6366F1', icon: '🟣' },

    // Browns
    { name: 'Marrom', color: '#92400E', icon: '🟤' },
    { name: 'Marrom Claro', color: '#D97706', icon: '🟤' },
    { name: 'Marrom Escuro', color: '#78350F', icon: '🟤' },
    { name: 'Chocolate', color: '#7C2D12', icon: '🟤' },
    { name: 'Café', color: '#451A03', icon: '🟤' },
    { name: 'Caramelo', color: '#B45309', icon: '🟤' },

    // Neutrals
    { name: 'Preto', color: '#1F2937', icon: '⚫' },
    { name: 'Cinza Escuro', color: '#374151', icon: '⚫' },
    { name: 'Cinza', color: '#6B7280', icon: '⚫' },
    { name: 'Cinza Claro', color: '#D1D5DB', icon: '⚪' },
    { name: 'Prata', color: '#9CA3AF', icon: '⚪' },
    { name: 'Branco', color: '#FFFFFF', icon: '⚪' },
    { name: 'Creme', color: '#FEF3C7', icon: '⚪' },
    { name: 'Bege', color: '#FDE68A', icon: '⚪' },
    { name: 'Areia', color: '#FBBF24', icon: '⚪' },
];

const ColorPicker = ({ value, onChange, label = "Cor da Coleira" }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            {/* Colors Grid with Scroll */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-96 overflow-y-auto p-1 border border-gray-200 rounded-lg bg-white">
                {COLLAR_COLORS.map((colorOption) => (
                    <button
                        key={colorOption.name}
                        type="button"
                        onClick={() => onChange(colorOption.name)}
                        className={`
                            flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all
                            hover:shadow-md
                            ${value === colorOption.name
                                ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                                : 'border-gray-200 hover:border-gray-300'
                            }
                        `}
                        title={colorOption.name}
                    >
                        <div
                            className="w-8 h-8 rounded-full mb-1 shadow-sm"
                            style={{
                                backgroundColor: colorOption.color,
                                border: colorOption.color === '#FFFFFF' ? '1px solid #d1d5db' : 'none'
                            }}
                        />
                        <span className="text-xs text-gray-600 text-center leading-tight">
                            {colorOption.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Current Selection Display */}
            {value && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                    <div
                        className="w-6 h-6 rounded-full shadow-sm"
                        style={{
                            backgroundColor: COLLAR_COLORS.find(c => c.name === value)?.color || '#ccc',
                            border: value === 'Branco' ? '1px solid #d1d5db' : 'none'
                        }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                        Selecionada: {value}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ColorPicker;
export { COLLAR_COLORS };
