import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlbumById, toggleLinkStatus, uploadMultiple, addMediaToAlbum, getMedia } from '../../services/mediaService';
import MediaViewer from '../../components/MediaViewer';

const AlbumDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Player State
    const [playerOpen, setPlayerOpen] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    useEffect(() => {
        loadAlbum();
    }, [id]);

    const loadAlbum = async () => {
        try {
            setLoading(true);
            const data = await getAlbumById(id);
            setAlbum(data);
        } catch (error) {
            console.error('Error loading album:', error);
            alert('Erro ao carregar álbum');
            navigate('/media-center/gallery?filter=albums');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleLink = async () => {
        try {
            await toggleLinkStatus(id, !album.is_link_active);
            await loadAlbum();
            alert(`Link ${!album.is_link_active ? 'ativado' : 'desativado'} com sucesso!`);
        } catch (error) {
            console.error('Error toggling link:', error);
            alert('Erro ao alterar status do link');
        }
    };

    const copyLink = () => {
        const link = `${window.location.origin}/album/${album.share_token}`;
        navigator.clipboard.writeText(link);
        alert('Link copiado!');
    };

    const handleAddPhotos = async (files) => {
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            // Upload files first
            const responseUpload = await uploadMultiple(Array.from(files), {});

            // Get IDs of uploaded files
            const mediaIds = responseUpload.files.map(f => f.id);

            // Add to album
            await addMediaToAlbum(id, mediaIds);

            // Reload album to show new photos
            await loadAlbum();
            alert(`${files.length} fotos adicionadas com sucesso!`);
        } catch (error) {
            console.error('Error adding photos:', error);
            alert('Erro ao adicionar fotos');
        } finally {
            setUploading(false);
        }
    };

    const getThumbnailUrl = (item) => {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        if (item.thumbnail_path) {
            return `${baseUrl}/uploads/media/${item.thumbnail_path}`;
        }
        return `${baseUrl}/uploads/media/${item.filename}`;
    };

    // Player control functions
    const openPlayer = (index) => {
        setCurrentMediaIndex(index);
        setPlayerOpen(true);
    };

    const closePlayer = () => {
        setPlayerOpen(false);
    };

    const nextMedia = () => {
        if (!album?.mediaFiles) return;
        setCurrentMediaIndex((prev) => (prev + 1) % album.mediaFiles.length);
    };

    const prevMedia = () => {
        if (!album?.mediaFiles) return;
        setCurrentMediaIndex((prev) => (prev - 1 + album.mediaFiles.length) % album.mediaFiles.length);
    };

    if (loading) {
        return <div className="p-8">Carregando...</div>;
    }

    if (!album) {
        return <div className="p-8">Álbum não encontrado</div>;
    }

    return (
        <div className="space-y-6 pb-24">
            {/* Header with Album Info */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <button
                                onClick={() => navigate('/media-center/gallery?filter=albums')}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">{album.name}</h1>
                            {album.is_hidden && (
                                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    OCULTO
                                </span>
                            )}
                        </div>
                        {album.description && (
                            <p className="text-gray-600 ml-12">{album.description}</p>
                        )}
                        <div className="flex items-center gap-4 ml-12 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-base">image</span>
                                {album.mediaFiles?.length || 0} fotos
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-base">calendar_today</span>
                                {new Date(album.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex gap-3 mt-6 pt-6 border-t">
                    <button
                        onClick={() => setIsLinkModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">link</span>
                        Gerenciar Link
                    </button>
                    <label className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                        {uploading ? 'Enviando...' : 'Adicionar Fotos'}
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={(e) => handleAddPhotos(e.target.files)}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                    <button
                        onClick={copyLink}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                        Copiar Link
                    </button>
                </div>
            </div>

            {/* Photos Grid */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Fotos do Álbum</h2>
                {album.mediaFiles && album.mediaFiles.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {album.mediaFiles.map((item, index) => (
                            <div
                                key={item.id}
                                className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
                                onClick={() => openPlayer(index)}
                            >
                                {item.file_type === 'image' ? (
                                    <img
                                        src={getThumbnailUrl(item)}
                                        alt={item.original_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full relative bg-gray-900 flex items-center justify-center">
                                        <img
                                            src={getThumbnailUrl(item)}
                                            alt={item.original_name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-4xl drop-shadow-lg">play_circle</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">Nenhuma foto neste álbum</p>
                )}
            </div>

            {/* Link Management Modal */}
            {isLinkModalOpen && (
                <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Gerenciar Link de Compartilhamento</h3>
                            <button
                                onClick={() => setIsLinkModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Link URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link de Compartilhamento</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={`${window.location.origin}/album/${album.share_token}`}
                                        className="w-full rounded-lg border-gray-300 bg-gray-50 text-gray-600"
                                    />
                                    <button
                                        onClick={copyLink}
                                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300"
                                        title="Copiar"
                                    >
                                        <span className="material-symbols-outlined">content_copy</span>
                                    </button>
                                </div>
                            </div>

                            {/* Analytics */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Total de Acessos</p>
                                        <p className="text-3xl font-bold text-blue-600">{album.access_count || 0}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-4xl text-blue-600">visibility</span>
                                </div>
                            </div>

                            {/* Toggle Active Status */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Status do Link</p>
                                    <p className="text-sm text-gray-600">
                                        {album.is_link_active ? 'Link ativo e acessível' : 'Link desativado'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleToggleLink}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${album.is_link_active ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${album.is_link_active ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Warning when inactive */}
                            {!album.is_link_active && (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
                                    <span className="material-symbols-outlined text-orange-600 text-sm">info</span>
                                    <p className="text-xs text-orange-800">
                                        Quando o link está desativado, ninguém consegue acessar este álbum através do link compartilhado.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Media Player Modal */}
            <MediaViewer
                isOpen={playerOpen}
                mediaItems={album?.mediaFiles || []}
                currentIndex={currentMediaIndex}
                onClose={closePlayer}
                onNext={nextMedia}
                onPrev={prevMedia}
            />
        </div>
    );
};

export default AlbumDetails;
