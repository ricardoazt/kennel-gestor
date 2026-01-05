import React from 'react';
import { useNavigate } from 'react-router-dom';

const MediaCenter = () => {
    const navigate = useNavigate();

    const quickActions = [
        {
            title: 'Galeria de Mídia',
            description: 'Gerencie fotos e vídeos do canil',
            icon: 'photo_library',
            color: 'bg-blue-500',
            path: '/media-center/gallery'
        },
        {
            title: 'Álbuns',
            description: 'Organize e compartilhe coleções de fotos',
            icon: 'folder_special',
            color: 'bg-orange-500',
            path: '/media-center/gallery?filter=albums'
        },
        {
            title: 'Campanhas',
            description: 'Crie e gerencie campanhas de divulgação',
            icon: 'campaign',
            color: 'bg-purple-500',
            path: '/media-center/campaigns'
        },
        {
            title: 'Nova Campanha',
            description: 'Crie uma nova campanha a partir de templates',
            icon: 'add_circle',
            color: 'bg-green-500',
            path: '/media-center/campaigns/new'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Central de Mídia</h1>
                <p className="mt-2 text-gray-600">
                    Gerencie suas mídias e crie campanhas de divulgação profissionais
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="material-symbols-outlined text-4xl text-blue-500">photo_library</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total de Mídias</p>
                            <p className="text-2xl font-semibold text-gray-900">--</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="material-symbols-outlined text-4xl text-purple-500">campaign</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Campanhas Ativas</p>
                            <p className="text-2xl font-semibold text-gray-900">--</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="material-symbols-outlined text-4xl text-green-500">visibility</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Visualizações Totais</p>
                            <p className="text-2xl font-semibold text-gray-900">--</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(action.path)}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 text-left"
                        >
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${action.color} text-white mb-4`}>
                                <span className="material-symbols-outlined text-3xl">{action.icon}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                            <p className="text-gray-600 text-sm">{action.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Atividade Recente</h2>
                </div>
                <div className="p-6">
                    <p className="text-gray-500 text-center py-8">
                        Nenhuma atividade recente
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MediaCenter;
