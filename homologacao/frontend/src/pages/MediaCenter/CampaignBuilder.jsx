import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTemplates, createCampaign } from '../../services/campaignService';

const CampaignBuilder = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Select Template, 2: Basic Info, 3: Content
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [campaignData, setCampaignData] = useState({
        title: '',
        campaign_type: '',
        template_id: null,
        seo_description: ''
    });

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            const response = await getTemplates();
            setTemplates(response || []);
        } catch (error) {
            console.error('Error loading templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setCampaignData({
            ...campaignData,
            campaign_type: template.template_type,
            template_id: template.id
        });
        setStep(2);
    };

    const handleCreateCampaign = async () => {
        if (!campaignData.title) {
            alert('Por favor, preencha o título da campanha');
            return;
        }

        try {
            const response = await createCampaign(campaignData);
            navigate(`/media-center/campaigns/edit/${response.campaign.id}`);
        } catch (error) {
            console.error('Error creating campaign:', error);
            alert('Erro ao criar campanha');
        }
    };

    const getTemplateIcon = (type) => {
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Nova Campanha</h1>
                    <p className="mt-2 text-gray-600">Crie uma campanha de divulgação profissional</p>
                </div>
                <button
                    onClick={() => navigate('/media-center/campaigns')}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            {/* Progress Steps */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                    <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                            1
                        </div>
                        <span className="ml-2 font-medium">Escolher Template</span>
                    </div>
                    <div className="flex-1 h-1 mx-4 bg-gray-200">
                        <div className={`h-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
                    </div>
                    <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                            2
                        </div>
                        <span className="ml-2 font-medium">Informações Básicas</span>
                    </div>
                </div>
            </div>

            {/* Step 1: Template Selection */}
            {step === 1 && (
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Escolha um Template</h2>
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Carregando templates...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => handleTemplateSelect(template)}
                                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 text-left"
                                >
                                    <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                                        <span className="material-symbols-outlined text-3xl text-blue-600">
                                            {getTemplateIcon(template.template_type)}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                                    <p className="text-sm text-gray-600">{template.description}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Basic Information */}
            {step === 2 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações da Campanha</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título da Campanha *
                            </label>
                            <input
                                type="text"
                                value={campaignData.title}
                                onChange={(e) => setCampaignData({ ...campaignData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ex: Lobo Vs Amora - Prenhez 2025"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descrição (SEO)
                            </label>
                            <textarea
                                value={campaignData.seo_description}
                                onChange={(e) => setCampaignData({ ...campaignData, seo_description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                                placeholder="Descrição que aparecerá ao compartilhar nas redes sociais"
                            />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <span className="material-symbols-outlined text-blue-600 mr-2">info</span>
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Template Selecionado</p>
                                    <p className="text-sm text-blue-700">{selectedTemplate?.name}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleCreateCampaign}
                                className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Criar Campanha
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignBuilder;
