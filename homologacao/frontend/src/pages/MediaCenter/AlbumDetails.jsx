import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlbumById, uploadMultiple, addMediaToAlbum, getMedia, removeMediaFromAlbum } from '../../services/mediaService';
import MediaViewer from '../../components/MediaViewer';
import ShareLinkManager from '../../components/ShareLinkManager';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import '../../styles/fancybox-custom.css';
import '../MediaCenter/GalleryMasonry.css';

const AlbumDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isShareManagerOpen, setIsShareManagerOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Player State
    const [playerOpen, setPlayerOpen] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    useEffect(() => {
        loadAlbum();

        // Initialize Fancybox with slide animations
        Fancybox.bind('[data-fancybox="album-gallery"]', {
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

    const handleRemoveFromAlbum = async (mediaId) => {
        if (!confirm('Deseja remover esta mídia do álbum? A mídia não será excluída permanentemente e continuará disponível na galeria principal.')) {
            return;
        }

        try {
            const response = await removeMediaFromAlbum(id, mediaId);

            // Check if album was deleted because it became empty
            if (response.albumDeleted) {
                alert('Álbum foi excluído automaticamente pois ficou vazio.');
                navigate('/media-center/gallery?filter=albums');
            } else {
                alert('Mídia removida do álbum com sucesso!');
                await loadAlbum();
            }
        } catch (error) {
            console.error('Error removing media from album:', error);
            alert('Erro ao remover mídia do álbum');
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
                        onClick={() => setIsShareManagerOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">link</span>
                        Gerenciar Links
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
                </div>
            </div>

            {/* Photos Grid */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Mídia do Álbum</h2>
                {album.mediaFiles && album.mediaFiles.length > 0 ? (
                    <div className="gallery-masonry-wrapper">
                        <div className="gallery-masonry">
                            {album.mediaFiles.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="gallery-masonry-item"
                                    style={{ position: 'relative' }}
                                >
                                    {/* Remove Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleRemoveFromAlbum(item.id);
                                        }}
                                        className="absolute top-2 right-2 z-10 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
                                        style={{
                                            transition: 'opacity 0.2s',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                        onMouseLeave={(e) => {
                                            if (!e.currentTarget.matches(':hover')) {
                                                e.currentTarget.style.opacity = '0';
                                            }
                                        }}
                                        title="Remover do álbum"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>

                                    {/* Media Content with Fancybox */}
                                    {item.file_type === 'image' ? (
                                        <a
                                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/uploads/media/${item.filename}`}
                                            data-fancybox="album-gallery"
                                            data-caption={item.original_name}
                                            onMouseEnter={(e) => {
                                                const btn = e.currentTarget.parentElement.querySelector('button');
                                                if (btn) btn.style.opacity = '1';
                                            }}
                                            onMouseLeave={(e) => {
                                                const btn = e.currentTarget.parentElement.querySelector('button');
                                                if (btn && !btn.matches(':hover')) btn.style.opacity = '0';
                                            }}
                                        >
                                            <img
                                                src={getThumbnailUrl(item)}
                                                alt={item.original_name}
                                            />
                                        </a>
                                    ) : (
                                        <a
                                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/uploads/media/${item.filename}`}
                                            data-fancybox="album-gallery"
                                            data-caption={item.original_name}
                                            onMouseEnter={(e) => {
                                                const btn = e.currentTarget.parentElement.querySelector('button');
                                                if (btn) btn.style.opacity = '1';
                                            }}
                                            onMouseLeave={(e) => {
                                                const btn = e.currentTarget.parentElement.querySelector('button');
                                                if (btn && !btn.matches(':hover')) btn.style.opacity = '0';
                                            }}
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
                    <p className="text-gray-500 text-center py-8">Nenhuma mídia neste álbum</p>
                )}
            </div>

            {/* Share Link Manager Modal */}
            <ShareLinkManager
                albumId={id}
                isOpen={isShareManagerOpen}
                onClose={() => setIsShareManagerOpen(false)}
            />

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
