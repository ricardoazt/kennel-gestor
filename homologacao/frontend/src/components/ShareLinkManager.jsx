import React, { useState, useEffect } from 'react';
import { createShareLink, getShareLinks, toggleShareLink, deleteShareLink } from '../services/mediaService';

const ShareLinkManager = ({ albumId, isOpen, onClose }) => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Create form state
    const [linkName, setLinkName] = useState('');
    const [linkDescription, setLinkDescription] = useState('');
    const [hasExpiration, setHasExpiration] = useState(false);
    const [expirationDate, setExpirationDate] = useState('');
    const [expirationTime, setExpirationTime] = useState('23:59');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadLinks();
        }
    }, [isOpen, albumId]);

    const loadLinks = async () => {
        try {
            setLoading(true);
            const response = await getShareLinks(albumId);
            setLinks(response.links || []);
        } catch (error) {
            console.error('Error loading share links:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLink = async () => {
        if (creating) return;

        setCreating(true);
        try {
            let expires_at = null;
            if (hasExpiration && expirationDate) {
                expires_at = `${expirationDate}T${expirationTime}:00`;
            }

            await createShareLink(albumId, {
                name: linkName || undefined,
                description: linkDescription || undefined,
                expires_at
            });

            // Reset form
            setLinkName('');
            setLinkDescription('');
            setHasExpiration(false);
            setExpirationDate('');
            setExpirationTime('23:59');
            setShowCreateForm(false);

            // Reload links
            await loadLinks();
        } catch (error) {
            console.error('Error creating share link:', error);
            alert('Erro ao criar link');
        } finally {
            setCreating(false);
        }
    };

    const handleToggle = async (linkId, currentStatus) => {
        try {
            await toggleShareLink(linkId, !currentStatus);
            await loadLinks();
        } catch (error) {
            console.error('Error toggling link:', error);
            alert('Erro ao alterar status do link');
        }
    };

    const handleDelete = async (linkId) => {
        if (!confirm('Tem certeza que deseja excluir este link? Esta ação não pode ser desfeita.')) return;

        try {
            await deleteShareLink(linkId);
            await loadLinks();
        } catch (error) {
            console.error('Error deleting link:', error);
            alert('Erro ao excluir link');
        }
    };

    const copyLink = (url) => {
        navigator.clipboard.writeText(url);
        alert('Link copiado!');
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const activeLinks = links.filter(l => l.is_valid);
    const inactiveLinks = links.filter(l => !l.is_valid);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Gerenciar Links de Compartilhamento</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Create Button */}
                    {!showCreateForm && (
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="w-full mb-6 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Criar Novo Link
                        </button>
                    )}

                    {/* Create Form */}
                    {showCreateForm && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-4">Novo Link de Compartilhamento</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome do Link (opcional)
                                    </label>
                                    <input
                                        type="text"
                                        value={linkName}
                                        onChange={(e) => setLinkName(e.target.value)}
                                        placeholder="Ex: Link para Cliente X"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descrição (opcional)
                                    </label>
                                    <textarea
                                        value={linkDescription}
                                        onChange={(e) => setLinkDescription(e.target.value)}
                                        placeholder="Adicione uma nota sobre este link"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows="2"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={hasExpiration}
                                            onChange={(e) => setHasExpiration(e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Definir data de expiração</span>
                                    </label>
                                </div>

                                {hasExpiration && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                                            <input
                                                type="date"
                                                value={expirationDate}
                                                onChange={(e) => setExpirationDate(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                                            <input
                                                type="time"
                                                value={expirationTime}
                                                onChange={(e) => setExpirationTime(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreateLink}
                                    disabled={creating}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {creating ? 'Criando...' : 'Criar Link'}
                                </button>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Carregando...</div>
                    ) : (
                        <>
                            {/* Active Links */}
                            {activeLinks.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        Links Ativos ({activeLinks.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {activeLinks.map((link) => (
                                            <div key={link.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{link.name}</h4>
                                                        {link.description && (
                                                            <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                                                        )}
                                                    </div>
                                                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                                        ATIVO
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-base">visibility</span>
                                                        {link.access_count} acessos
                                                    </span>
                                                    {link.expires_at && (
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-base">schedule</span>
                                                            Expira: {formatDate(link.expires_at)}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => copyLink(link.url)}
                                                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center gap-1"
                                                    >
                                                        <span className="material-symbols-outlined text-base">content_copy</span>
                                                        Copiar Link
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggle(link.id, link.is_active)}
                                                        className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 text-sm flex items-center gap-1"
                                                        title="Revogar"
                                                    >
                                                        <span className="material-symbols-outlined text-base">lock</span>
                                                        Revogar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(link.id)}
                                                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                                                        title="Excluir"
                                                    >
                                                        <span className="material-symbols-outlined text-base">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Inactive Links */}
                            {inactiveLinks.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        Links Inativos ({inactiveLinks.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {inactiveLinks.map((link) => (
                                            <div key={link.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-75">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-700">{link.name}</h4>
                                                        {link.description && (
                                                            <p className="text-sm text-gray-500 mt-1">{link.description}</p>
                                                        )}
                                                    </div>
                                                    <span className="ml-2 px-2 py-1 bg-gray-300 text-gray-700 text-xs font-semibold rounded-full">
                                                        {link.is_expired ? 'EXPIRADO' : 'REVOGADO'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-base">visibility</span>
                                                        {link.access_count} acessos
                                                    </span>
                                                </div>

                                                <div className="flex gap-2">
                                                    {!link.is_expired && (
                                                        <button
                                                            onClick={() => handleToggle(link.id, link.is_active)}
                                                            className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm flex items-center justify-center gap-1"
                                                        >
                                                            <span className="material-symbols-outlined text-base">check_circle</span>
                                                            Reativar
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(link.id)}
                                                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm flex items-center gap-1"
                                                    >
                                                        <span className="material-symbols-outlined text-base">delete</span>
                                                        Excluir
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {links.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-2">link_off</span>
                                    <p>Nenhum link criado ainda</p>
                                    <p className="text-sm mt-1">Clique em "Criar Novo Link" para começar</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareLinkManager;
