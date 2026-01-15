import React from 'react';
import pregnancyService from '../services/pregnancyService';

const PregnancyCard = ({ pregnancy, onClick }) => {
    const daysPregnant = pregnancyService.calculateDaysPregnant(pregnancy.breeding_date);
    const totalDays = 63;
    const progress = pregnancyService.calculateProgress(pregnancy.breeding_date);
    const daysRemaining = Math.max(0, totalDays - daysPregnant);

    // Get dog photos
    const motherPhoto = pregnancy.Mother?.photos?.[0] || null;
    const fatherPhoto = pregnancy.Father?.photos?.[0] || null;

    // Status badge
    const getStatusBadge = (status) => {
        const badges = {
            pregnant: { label: 'Em Gestação', color: 'bg-blue-500' },
            born: { label: 'Nascidos', color: 'bg-green-500' },
            lost: { label: 'Perdido', color: 'bg-red-500' },
            cancelled: { label: 'Cancelado', color: 'bg-gray-500' }
        };
        return badges[status] || badges.pregnant;
    };

    const statusBadge = getStatusBadge(pregnancy.status);

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-100 hover:border-blue-300"
        >
            {/* Header with parents */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-pink-500 text-xl">female</span>
                            <span className="font-semibold text-gray-900">{pregnancy.Mother?.nome}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-500 text-xl">male</span>
                            <span className="font-semibold text-gray-900">{pregnancy.Father?.nome}</span>
                        </div>
                    </div>

                    {/* Status badge */}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusBadge.color}`}>
                        {statusBadge.label}
                    </span>
                </div>

                {/* Parent photos */}
                <div className="flex gap-2 mt-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                        {motherPhoto ? (
                            <img
                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${motherPhoto}`}
                                alt={pregnancy.Mother?.nome}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-gray-400 text-3xl">pets</span>
                            </div>
                        )}
                    </div>
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                        {fatherPhoto ? (
                            <img
                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${fatherPhoto}`}
                                alt={pregnancy.Father?.nome}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-gray-400 text-3xl">pets</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress section */}
            <div className="p-4">
                {pregnancy.status === 'pregnant' ? (
                    <>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Progresso da Gestação</span>
                            <span className="text-sm font-bold text-blue-600">
                                {Math.min(daysPregnant, totalDays)}/{totalDays} dias
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="flex justify-between text-xs text-gray-600">
                            <span>Cruza: {new Date(pregnancy.breeding_date).toLocaleDateString('pt-BR')}</span>
                            <span className="font-medium">
                                {daysRemaining > 0 ? `${daysRemaining} dias restantes` : 'Parto próximo!'}
                            </span>
                        </div>

                        {daysRemaining <= 7 && daysRemaining > 0 && (
                            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                                <span className="material-symbols-outlined text-amber-600 text-sm">warning</span>
                                <span className="text-xs text-amber-700 font-medium">Parto se aproximando!</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-sm">event</span>
                            <span>Cruza: {new Date(pregnancy.breeding_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        {pregnancy.actual_birth_date && (
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">celebration</span>
                                <span>Nascimento: {new Date(pregnancy.actual_birth_date).toLocaleDateString('pt-BR')}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Observations preview */}
                {pregnancy.observations && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 line-clamp-2">{pregnancy.observations}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PregnancyCard;
