import React from 'react';

const COLLAR_COLORS = [
    { name: 'Vermelho', color: '#EF4444', icon: '🔴' },
    { name: 'Azul', color: '#3B82F6', icon: '🔵' },
    { name: 'Verde', color: '#10B981', icon: '🟢' },
    { name: 'Amarelo', color: '#F59E0B', icon: '🟡' },
    { name: 'Rosa', color: '#EC4899', icon: '💗' },
    { name: 'Roxo', color: '#8B5CF6', icon: '🟣' },
    { name: 'Laranja', color: '#F97316', icon: '🟠' },
    { name: 'Marrom', color: '#92400E', icon: '🟤' },
    { name: 'Preto', color: '#1F2937', icon: '⚫' },
    { name: 'Branco', color: '#FFFFFF', icon: '⚪' },
    { name: 'Cinza', color: '#6B7280', icon: '⚫' },
    { name: 'Turquesa', color: '#14B8A6', icon: '🔷' },
    { name: 'Dourado', color: '#D97706', icon: '🟡' },
    { name: 'Prata', color: '#9CA3AF', icon: '⚪' },
    { name: 'Limão', color: '#84CC16', icon: '🟢' },
    { name: 'Navy', color: '#1E40AF', icon: '🔵' },
    { name: 'Coral', color: '#F87171', icon: '🟠' },
    { name: 'Lavanda', color: '#A78BFA', icon: '🟣' },
    { name: 'Menta', color: '#6EE7B7', icon: '🟢' },
    { name: 'Pêssego', color: '#FDBA74', icon: '🟠' }
];

const ColorPicker = ({ value, onChange, label = "Cor da Coleira" }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {COLLAR_COLORS.map((colorOption) => (
                    <button
                        key={colorOption.name}
                        type="button"
                        onClick={() => onChange(colorOption.name)}
                        className={`
                            flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all
                            hover:shadow-md
                            ${value === colorOption.name
                                ? 'border-blue-500 bg-blue-50 shadow-md'
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
