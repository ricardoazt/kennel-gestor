import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicAlbum } from '../services/mediaService';
import MediaViewer from '../components/MediaViewer';

const SharedAlbum = () => {
    const { token } = useParams();
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [playerOpen, setPlayerOpen] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    useEffect(() => {
        const loadAlbum = async () => {
            try {
                setLoading(true);
                const data = await getPublicAlbum(token);
                setAlbum(data);
            } catch (err) {
                console.error('Error loading album:', err);
                setError('Álbum não encontrado ou link expirado.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            loadAlbum();
        }
    }, [token]);

    const getMediaUrl = (mediaItem) => {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        return `${baseUrl}/uploads/media/${mediaItem.filename}`;
    };

    const getThumbnailUrl = (mediaItem) => {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        if (mediaItem.thumbnail_path) {
            return `${baseUrl}/uploads/media/${mediaItem.thumbnail_path}`;
        }
        return getMediaUrl(mediaItem);
    };

    const openPlayer = (index) => {
        setCurrentMediaIndex(index);
        setPlayerOpen(true);
    };

    const closePlayer = () => {
        setPlayerOpen(false);
    };

    const nextMedia = () => {
        if (album && album.mediaFiles) {
            setCurrentMediaIndex((prev) => (prev + 1) % album.mediaFiles.length);
        }
    };

    const prevMedia = () => {
        if (album && album.mediaFiles) {
            setCurrentMediaIndex((prev) => (prev - 1 + album.mediaFiles.length) % album.mediaFiles.length);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">broken_image</span>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Ops!</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">{album.name}</h1>
                    {album.description && (
                        <p className="mt-2 text-gray-600">{album.description}</p>
                    )}
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                        <span className="material-symbols-outlined text-lg mr-1">photo_library</span>
                        {album.mediaFiles?.length || 0} itens
                        <span className="mx-2">•</span>
                        <span>Criado por {album.creator?.name || 'Usuário'}</span>
                    </div>
                </div>
            </header>

            {/* Gallery Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {album.mediaFiles?.map((item, index) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow overflow-hidden group relative cursor-pointer aspect-square"
                            onClick={() => openPlayer(index)}
                        >
                            {item.file_type === 'image' ? (
                                <img
                                    src={getThumbnailUrl(item)}
                                    alt={item.original_name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center relative bg-gray-100">
                                    <img
                                        src={item.thumbnail_path ? getThumbnailUrl(item) : ''}
                                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                                    />
                                    <span className="material-symbols-outlined text-6xl text-gray-600 relative z-10">play_circle</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            {/* Lightbox Player */}
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

export default SharedAlbum;
