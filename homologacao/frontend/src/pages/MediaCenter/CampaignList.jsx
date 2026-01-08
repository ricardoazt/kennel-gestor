import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCampaigns, deleteCampaign, publishCampaign } from '../../services/campaignService';

const CampaignList = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, draft, published, archived

    useEffect(() => {
        loadCampaigns();
    }, [filter]);

    const loadCampaigns = async () => {
        try {
            setLoading(true);
            const filters = filter !== 'all' ? { status: filter } : {};
            const response = await getCampaigns(filters);
            setCampaigns(response.campaigns || []);
        } catch (error) {
            console.error('Error loading campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta campanha?')) return;

        try {
            await deleteCampaign(id);
            await loadCampaigns();
        } catch (error) {
            console.error('Error deleting campaign:', error);
            alert('Erro ao excluir campanha');
        }
    };

    const handlePublish = async (id) => {
        try {
            await publishCampaign(id);
            await loadCampaigns();
        } catch (error) {
            console.error('Error publishing campaign:', error);
            alert('Erro ao publicar campanha');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Rascunho' },
            published: { color: 'bg-green-100 text-green-800', label: 'Publicado' },
            archived: { color: 'bg-gray-100 text-gray-800', label: 'Arquivado' }
        };
        const badge = badges[status] || badges.draft;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                {badge.label}
            </span>
        );
    };

    const getCampaignTypeIcon = (type) => {
        const icons = {
            breeding: 'favorite',
            litter: 'grid_view',
            availability: 'pets',
            landing: 'web',
            gallery: 'photo_library',
            event: 'event'
        };
        return icons[type] || 'campaign';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Campanhas</h1>
                    <p className="mt-2 text-gray-600">Gerencie suas campanhas de divulgação</p>
                </div>
                <button
                    onClick={() => navigate('/media-center/campaigns/new')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <span className="material-symbols-outlined mr-2">add</span>
                    Nova Campanha
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setFilter('draft')}
                        className={`px-4 py-2 rounded-lg ${filter === 'draft' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Rascunhos
                    </button>
                    <button
                        onClick={() => setFilter('published')}
                        className={`px-4 py-2 rounded-lg ${filter === 'published' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Publicadas
                    </button>
                </div>
            </div>

            {/* Campaigns List */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Carregando...</p>
                </div>
            ) : campaigns.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">campaign</span>
                    <p className="text-gray-500 mb-4">Nenhuma campanha encontrada</p>
                    <button
                        onClick={() => navigate('/media-center/campaigns/new')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <span className="material-symbols-outlined mr-2">add</span>
                        Criar Primeira Campanha
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                        <div key={campaign.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                            {/* Card Header */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                            <span className="material-symbols-outlined text-blue-600">
                                                {getCampaignTypeIcon(campaign.campaign_type)}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                                            {getStatusBadge(campaign.status)}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center">
                                        <span className="material-symbols-outlined text-sm mr-1">visibility</span>
                                        {campaign.views_count || 0}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="material-symbols-outlined text-sm mr-1">share</span>
                                        {campaign.shares_count || 0}
                                    </div>
                                </div>

                                {/* Description */}
                                {campaign.seo_description && (
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                        {campaign.seo_description}
                                    </p>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {campaign.status === 'draft' && (
                                        <button
                                            onClick={() => handlePublish(campaign.id)}
                                            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                        >
                                            Publicar
                                        </button>
                                    )}
                                    {campaign.status === 'published' && (
                                        <a
                                            href={`/p/${campaign.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm text-center"
                                        >
                                            Ver Página
                                        </a>
                                    )}
                                    <button
                                        onClick={() => navigate(`/media-center/campaigns/edit/${campaign.id}`)}
                                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(campaign.id)}
                                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CampaignList;
