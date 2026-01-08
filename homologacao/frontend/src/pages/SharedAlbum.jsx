import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicAlbum } from '../services/mediaService';
import MediaViewer from '../components/MediaViewer';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import '../styles/fancybox-custom.css';
import './MediaCenter/GalleryMasonry.css';

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

        // Initialize Fancybox with slide animations
        Fancybox.bind('[data-fancybox="shared-album-gallery"]', {
            animated: true,
            showClass: "fancybox-fadeIn",
            hideClass: "fancybox-fadeOut",

            // Slide animation when changing images
            Carousel: {
                transition: "slide",
                friction: 0.8,
            },

            // Thumbnails configuration
            Thumbs: {
                autoStart: true,
                axis: "x", // Horizontal scrolling
            },

            // Toolbar configuration
            Toolbar: {
                display: {
                    left: ["infobar"],
                    middle: [],
                    right: ["slideshow", "thumbs", "close"],
                },
            },

            // Image settings
            Images: {
                zoom: true,
                protected: true,
            },

            // Event handlers
            on: {
                ready: (fancybox) => {
                    // Handle thumbs button click to hide/show thumbnails
                    const thumbsBtn = fancybox.container.querySelector('.fancybox__button--thumbs');
                    if (thumbsBtn) {
                        thumbsBtn.addEventListener('click', () => {
                            const thumbsContainer = fancybox.container.querySelector('.fancybox__thumbs');
                            if (thumbsContainer) {
                                thumbsContainer.classList.toggle('is-hidden');
                            }
                        });
                    }
                },
            },
        });

        return () => {
            Fancybox.destroy();
        };
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
                {album.mediaFiles && album.mediaFiles.length > 0 ? (
                    <div className="gallery-masonry-wrapper">
                        <div className="gallery-masonry">
                            {album.mediaFiles.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="gallery-masonry-item"
                                >
                                    {/* Media Content with Fancybox */}
                                    {item.file_type === 'image' ? (
                                        <a
                                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/uploads/media/${item.filename}`}
                                            data-fancybox="shared-album-gallery"
                                            data-caption={item.original_name}
                                        >
                                            <img
                                                src={getThumbnailUrl(item)}
                                                alt={item.original_name}
                                            />
                                        </a>
                                    ) : (
                                        <a
                                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/uploads/media/${item.filename}`}
                                            data-fancybox="shared-album-gallery"
                                            data-caption={item.original_name}
                                        >
                                            <div className="video-thumbnail-container">
                                                <img
                                                    src={getThumbnailUrl(item)}
                                                    alt={item.original_name}
                                                />
                                                <span className="material-symbols-outlined video-play-icon">play_circle</span>
                                                <span className="video-badge">VIDEO</span>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-12">Nenhuma mídia neste álbum</p>
                )}
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
