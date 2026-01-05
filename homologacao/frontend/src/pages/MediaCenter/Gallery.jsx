import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMedia, uploadMedia, deleteMedia, createAlbum, addMediaToAlbum, getAlbums, deleteAlbum } from '../../services/mediaService';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Gallery = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [filter, setFilter] = useState(searchParams.get('filter') || 'all'); // all, image, video, albums
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    // Selection State
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    // Player State
    const [playerOpen, setPlayerOpen] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    // Album Modals State
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isCreateAlbumModalOpen, setIsCreateAlbumModalOpen] = useState(false);
    const [isAddToAlbumModalOpen, setIsAddToAlbumModalOpen] = useState(false);
    const [isEditAlbumModalOpen, setIsEditAlbumModalOpen] = useState(false);

    // Album Data State
    const [albumName, setAlbumName] = useState('');
    const [albumDescription, setAlbumDescription] = useState('');
    const [sharedLink, setSharedLink] = useState(null);
    const [creatingAlbum, setCreatingAlbum] = useState(false);
    const [selectedAlbumToAdd, setSelectedAlbumToAdd] = useState('');
    const [editingAlbum, setEditingAlbum] = useState(null);
    const [selectedMediaForAlbum, setSelectedMediaForAlbum] = useState(new Set());
    const [availableMedia, setAvailableMedia] = useState([]);
    const [showHiddenAlbums, setShowHiddenAlbums] = useState(false);

    useEffect(() => {
        const urlFilter = searchParams.get('filter');
        if (urlFilter && urlFilter !== filter) {
            setFilter(urlFilter);
        }
    }, [searchParams]);

    useEffect(() => {
        loadMedia();
    }, [filter, showHiddenAlbums]);

    const loadMedia = async () => {
        try {
            setLoading(true);
            if (filter === 'albums') {
                const albumFilters = showHiddenAlbums ? { include_hidden: 'true' } : {};
                const response = await getAlbums(albumFilters);
                setAlbums(response || []);
            } else {
                const filters = filter !== 'all' ? { file_type: filter } : {};
                if (selectedAlbum) {
                    filters.album_id = selectedAlbum.id;
                }
                const response = await getMedia(filters);
                setMedia(response.media || []);
            }
        } catch (error) {
            console.error('Error loading media:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        setUploading(true);
        try {
            for (const file of files) {
                await uploadMedia(file);
            }
            await loadMedia();
        } catch (error) {
            console.error('Error uploading files:', error);
            alert('Erro ao fazer upload dos arquivos');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        console.log('Frontend: handleDelete called for ID:', id);
        // Debug alert to confirm click is registered
        alert('Iniciando exclusão...');

        if (!window.confirm('Tem certeza que deseja excluir esta mídia?')) return;

        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            console.log('Frontend: Sending DELETE to:', `${baseUrl}/api/media/${id}`);
            const result = await deleteMedia(id);
            console.log('Frontend: deleteMedia result:', result);
            await loadMedia();
        } catch (error) {
            console.error('Error deleting media:', error);
            console.error('Error details:', error.response?.data || error.message);
            alert(`Erro ao excluir mídia: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleDeleteAlbum = async (id) => {
        console.log('Frontend: handleDeleteAlbum called for ID:', id);
        // Debug alert to confirm click is registered
        alert('Iniciando exclusão do álbum...');

        if (!window.confirm('Tem certeza que deseja excluir este álbum? As mídias não serão excluídas.')) return;

        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            console.log('Frontend: Sending DELETE to:', `${baseUrl}/api/media/albums/${id}`);
            const result = await deleteAlbum(id);
            console.log('Frontend: deleteAlbum result:', result);
            await loadMedia();
        } catch (error) {
            console.error('Error deleting album:', error);
            console.error('Error details:', error.response?.data || error.message);
            alert(`Erro ao excluir álbum: ${error.response?.data?.error || error.message}`);
        }
    };

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

    // --- Selection Logic ---
    const toggleSelection = (id) => {
        const newSelection = new Set(selectedItems);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedItems(newSelection);
    };

    const selectAll = () => {
        if (selectedItems.size === media.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(media.map(m => m.id)));
        }
    };

    // --- Bulk Actions ---
    const handleBulkDelete = async () => {
        if (!confirm(`Tem certeza que deseja excluir ${selectedItems.size} itens?`)) return;

        try {
            for (const id of selectedItems) {
                await deleteMedia(id);
            }
            setSelectedItems(new Set());
            await loadMedia();
        } catch (error) {
            console.error('Error deleting media:', error);
            alert('Erro ao excluir alguns itens');
        }
    };

    const handleDownloadZip = async () => {
        try {
            const zip = new JSZip();
            const folder = zip.folder("midia-selecionada");
            const items = media.filter(m => selectedItems.has(m.id));

            // Show loading or toast here

            for (const item of items) {
                const url = getMediaUrl(item);
                const response = await fetch(url);
                const blob = await response.blob();
                folder.file(item.original_name, blob);
            }

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "midia-kennel.zip");
        } catch (error) {
            console.error('Error generating zip:', error);
            alert('Erro ao gerar arquivo ZIP');
        }
    };

    // --- Player Logic ---
    const openPlayer = (index) => {
        setCurrentMediaIndex(index);
        setPlayerOpen(true);
    };

    const closePlayer = () => {
        setPlayerOpen(false);
    };

    const nextMedia = (e) => {
        e.stopPropagation();
        setCurrentMediaIndex((prev) => (prev + 1) % media.length);
    };

    const prevMedia = (e) => {
        e.stopPropagation();
        setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    // --- Share Logic ---
    const handleShare = () => {
        setAlbumName(`Álbum Compartilhado - ${new Date().toLocaleDateString()}`);
        setSharedLink(null);
        setIsShareModalOpen(true);
    };

    const confirmShare = async () => {
        if (!albumName.trim()) return;

        setCreatingAlbum(true);
        try {
            // 1. Create Album
            const albumResponse = await createAlbum({
                name: albumName,
                description: 'Álbum criado via compartilhamento da galeria',
                cover_image_id: Array.from(selectedItems)[0], // Use first item as cover
                is_hidden: true // SEMPRE oculto
            });

            const album = albumResponse.album;

            // 2. Add Media to Album
            await addMediaToAlbum(album.id, Array.from(selectedItems));

            // 3. Generate Link
            const link = `${window.location.origin}/album/${album.share_token}`;
            setSharedLink(link);

            // Refresh media to see updated albums (if we were showing albums)
            // await loadMedia(); 
        } catch (error) {
            console.error('Error creating shared album:', error);
            alert('Erro ao criar álbum compartilhado');
        } finally {
            setCreatingAlbum(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(sharedLink);
        alert('Link copiado!');
    };

    // --- Create Album Logic ---
    const handleCreateAlbum = () => {
        setAlbumName(`Novo Álbum - ${new Date().toLocaleDateString()}`);
        setAlbumDescription('');
        setIsCreateAlbumModalOpen(true);
    };

    const confirmCreateAlbum = async () => {
        if (!albumName.trim()) return;

        setCreatingAlbum(true);
        try {
            const albumResponse = await createAlbum({
                name: albumName,
                description: albumDescription,
                cover_image_id: Array.from(selectedItems)[0],
                is_hidden: false // Álbum normal (visível)
            });

            const album = albumResponse.album;
            await addMediaToAlbum(album.id, Array.from(selectedItems));

            setIsCreateAlbumModalOpen(false);
            setSelectedItems(new Set());
            alert('Álbum criado com sucesso!');

            if (filter === 'albums') {
                await loadMedia();
            }
        } catch (error) {
            console.error('Error creating album:', error);
            alert('Erro ao criar álbum');
        } finally {
            setCreatingAlbum(false);
        }
    };

    // --- Add to Album Logic ---
    const handleAddToAlbum = async () => {
        // Load albums if not loaded
        if (albums.length === 0) {
            const response = await getAlbums();
            setAlbums(response || []);
        }
        setSelectedAlbumToAdd('');
        setIsAddToAlbumModalOpen(true);
    };

    const confirmAddToAlbum = async () => {
        if (!selectedAlbumToAdd) return;

        try {
            await addMediaToAlbum(selectedAlbumToAdd, Array.from(selectedItems));
            setIsAddToAlbumModalOpen(false);
            setSelectedItems(new Set());
            alert('Fotos adicionadas ao álbum!');
        } catch (error) {
            console.error('Error adding to album:', error);
            alert('Erro ao adicionar fotos ao álbum');
        }
    };

    // --- Edit Album Logic ---
    const handleEditAlbum = async (album) => {
        setEditingAlbum(album);
        setSelectedMediaForAlbum(new Set());

        // Load all media not in this album
        try {
            const response = await getMedia({});
            const albumMediaIds = new Set(album.mediaFiles?.map(m => m.id) || []);
            const available = response.media.filter(m => !albumMediaIds.has(m.id));
            setAvailableMedia(available);
            setIsEditAlbumModalOpen(true);
        } catch (error) {
            console.error('Error loading media for edit:', error);
            alert('Erro ao carregar mídias disponíveis');
        }
    };

    const toggleMediaSelection = (id) => {
        const newSelection = new Set(selectedMediaForAlbum);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedMediaForAlbum(newSelection);
    };

    const confirmAddPhotosToAlbum = async () => {
        if (selectedMediaForAlbum.size === 0) return;

        try {
            await addMediaToAlbum(editingAlbum.id, Array.from(selectedMediaForAlbum));
            setIsEditAlbumModalOpen(false);
            alert(`${selectedMediaForAlbum.size} fotos adicionadas ao álbum!`);

            // Reload albums to show updated count
            if (filter === 'albums') {
                await loadMedia();
            }
        } catch (error) {
            console.error('Error adding photos to album:', error);
            alert('Erro ao adicionar fotos ao álbum');
        }
    };

    const copyAlbumLink = (album) => {
        const link = `${window.location.origin}/album/${album.share_token}`;
        navigator.clipboard.writeText(link);
        alert('Link do álbum copiado!');
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Galeria de Mídia</h1>
                        <p className="mt-2 text-gray-600">Gerencie fotos e vídeos do canil</p>
                    </div>
                    {media.length > 0 && (
                        <div className="flex items-center gap-2 ml-4">
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                                <input
                                    type="checkbox"
                                    checked={media.length > 0 && selectedItems.size === media.length}
                                    onChange={selectAll}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                Selecionar Tudo
                            </label>
                        </div>
                    )}
                </div>
                <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                    <span className="material-symbols-outlined mr-2">upload</span>
                    {uploading ? 'Enviando...' : 'Upload'}
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                    />
                </label>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setFilter('all');
                            setSearchParams({});
                        }}
                        className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => {
                            setFilter('image');
                            setSearchParams({ filter: 'image' });
                        }}
                        className={`px-4 py-2 rounded-lg ${filter === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <span className="material-symbols-outlined align-middle mr-1">image</span>
                        Fotos
                    </button>
                    <button
                        onClick={() => {
                            setFilter('video');
                            setSearchParams({ filter: 'video' });
                        }}
                        className={`px-4 py-2 rounded-lg ${filter === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <span className="material-symbols-outlined align-middle mr-1">videocam</span>
                        Vídeos
                    </button>
                    <button
                        onClick={() => {
                            setFilter('albums');
                            setSearchParams({ filter: 'albums' });
                            setSelectedAlbum(null);
                        }}
                        className={`px-4 py-2 rounded-lg ${filter === 'albums' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <span className="material-symbols-outlined align-middle mr-1">folder_special</span>
                        Álbuns
                    </button>
                </div>
                {filter === 'albums' && (
                    <div className="mt-4 flex items-center gap-2 px-2">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900 select-none">
                            <input
                                type="checkbox"
                                checked={showHiddenAlbums}
                                onChange={(e) => setShowHiddenAlbums(e.target.checked)}
                                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="material-symbols-outlined text-base">visibility_off</span>
                            Mostrar Álbuns Ocultos
                        </label>
                    </div>
                )}
                {selectedAlbum && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                        <span className="material-symbols-outlined text-base">folder_open</span>
                        Filtrando por: <span className="font-semibold text-blue-600">{selectedAlbum.name}</span>
                        <button
                            onClick={() => {
                                setSelectedAlbum(null);
                                loadMedia();
                            }}
                            className="text-red-500 hover:text-red-700 ml-2"
                        >
                            Limpar Filtro
                        </button>
                    </div>
                )}
            </div>

            {/* Gallery Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Carregando...</p>
                </div>
            ) : filter === 'albums' ? (
                albums.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">folder_off</span>
                        <p className="text-gray-500">Nenhum álbum encontrado</p>
                        <p className="text-sm text-gray-400 mt-2">Selecione fotos na galeria e use a opção "Compartilhar" para criar um álbum.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {albums.map((album) => (
                            <div
                                key={album.id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer border border-gray-100"
                                onClick={() => {
                                    setSelectedAlbum(album);
                                    setFilter('all');
                                }}
                            >
                                <div className="aspect-[4/3] bg-gray-100 relative">
                                    {album.coverImage ? (
                                        <img
                                            src={getThumbnailUrl(album.coverImage)}
                                            alt={album.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <span className="material-symbols-outlined text-5xl">folder</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <span className="text-white text-sm font-medium flex items-center gap-1">
                                            <span className="material-symbols-outlined text-base">visibility</span>
                                            Ver fotos
                                        </span>
                                    </div>
                                    {album.is_hidden ? (
                                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                            OCULTO
                                        </div>
                                    ) : album.is_public && (
                                        <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                            PÚBLICO
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 truncate">{album.name}</h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">image</span>
                                            {album.mediaFiles?.length || 0} itens
                                        </span>
                                        <div className="flex gap-1">
                                            {/* Botão Editar */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditAlbum(album);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                                                title="Adicionar fotos"
                                            >
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>

                                            {/* Botão Compartilhar */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyAlbumLink(album);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                                                title="Copiar link"
                                            >
                                                <span className="material-symbols-outlined text-lg">share</span>
                                            </button>

                                            {/* Botão Excluir */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAlbum(album.id);
                                                }}
                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                                                title="Excluir álbum"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : media.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">photo_library</span>
                    <p className="text-gray-500 mb-4">Nenhuma mídia encontrada</p>
                    <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                        <span className="material-symbols-outlined mr-2">upload</span>
                        Fazer Upload
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {media.map((item, index) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-lg shadow overflow-hidden group relative transition-all ${selectedItems.has(item.id) ? 'ring-4 ring-blue-500 ring-offset-2' : ''}`}
                        >
                            {/* Checkbox Overlay */}
                            <div className={`absolute top-2 left-2 z-10 ${selectedItems.has(item.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.has(item.id)}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        toggleSelection(item.id);
                                    }}
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shadow-sm"
                                />
                            </div>

                            {/* Media Preview */}
                            <div
                                className="aspect-square bg-gray-100 relative cursor-pointer"
                                onClick={() => openPlayer(index)}
                            >
                                {item.file_type === 'image' ? (
                                    <img
                                        src={getThumbnailUrl(item)}
                                        alt={item.original_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center relative">
                                        <img
                                            src={item.thumbnail_path ? getThumbnailUrl(item) : ''}
                                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                                        />
                                        <span className="material-symbols-outlined text-6xl text-gray-600 relative z-10">play_circle</span>
                                        <span className="absolute bottom-2 right-2 text-xs font-medium text-white bg-black/50 px-1.5 py-0.5 rounded">VIDEO</span>
                                    </div>
                                )}

                                {/* Hover actions */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-50">
                                    <a
                                        href={getMediaUrl(item)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm"
                                        title="Abrir em nova aba"
                                    >
                                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                                    </a>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('Media delete clicked');
                                            handleDelete(item.id);
                                        }}
                                        className="p-1.5 bg-red-500/50 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm"
                                        title="Excluir"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-3">
                                <p className="text-sm font-medium text-gray-900 truncate" title={item.original_name}>{item.original_name}</p>
                                <p className="text-xs text-gray-500 mt-1 flex justify-between">
                                    <span>{item.file_type === 'image' ? 'IMG' : 'VID'}</span>
                                    <span>{item.file_size && `${(item.file_size / 1024 / 1024).toFixed(2)} MB`}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Floating Action Bar */}
            {selectedItems.size > 0 && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-6 animate-slide-up">
                    <div className="flex items-center gap-3 border-r border-gray-700 pr-6">
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">{selectedItems.size}</span>
                        <span className="text-sm font-medium">Selecionados</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Criar Álbum Normal */}
                        <button
                            onClick={handleCreateAlbum}
                            className="p-2 hover:bg-gray-800 rounded-full transition-colors relative group"
                            title="Criar Álbum"
                        >
                            <span className="material-symbols-outlined">create_new_folder</span>
                            <span className="text-[10px] hidden group-hover:block absolute -top-8 bg-black px-2 py-1 rounded whitespace-nowrap">Criar Álbum</span>
                        </button>

                        {/* Adicionar a Álbum Existente */}
                        <button
                            onClick={handleAddToAlbum}
                            className="p-2 hover:bg-gray-800 rounded-full transition-colors relative group"
                            title="Adicionar a Álbum"
                        >
                            <span className="material-symbols-outlined">add_photo_alternate</span>
                            <span className="text-[10px] hidden group-hover:block absolute -top-8 bg-black px-2 py-1 rounded whitespace-nowrap">Adicionar a Álbum</span>
                        </button>

                        {/* Compartilhar (Criar Oculto) */}
                        <button
                            className="p-2 hover:bg-gray-800 rounded-full transition-colors relative group"
                            onClick={handleShare}
                        >
                            <span className="material-symbols-outlined">share</span>
                            <span className="text-[10px] hidden group-hover:block absolute -top-8 bg-black px-2 py-1 rounded whitespace-nowrap">Criar Link</span>
                        </button>

                        <div className="w-px h-8 bg-gray-700 mx-2"></div>

                        {/* Download ZIP */}
                        <button
                            onClick={handleDownloadZip}
                            className="p-2 hover:bg-gray-800 rounded-full transition-colors relative group"
                        >
                            <span className="material-symbols-outlined">download</span>
                            <span className="text-[10px] hidden group-hover:block absolute -top-8 bg-black px-2 py-1 rounded whitespace-nowrap">Baixar ZIP</span>
                        </button>

                        {/* Excluir */}
                        <button
                            onClick={handleBulkDelete}
                            className="p-2 hover:bg-red-900/50 text-red-400 rounded-full transition-colors relative group"
                        >
                            <span className="material-symbols-outlined">delete</span>
                            <span className="text-[10px] hidden group-hover:block absolute -top-8 bg-black px-2 py-1 rounded whitespace-nowrap">Excluir</span>
                        </button>
                    </div>

                    <button
                        onClick={() => setSelectedItems(new Set())}
                        className="ml-2 text-gray-400 hover:text-white text-xl"
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Floating Player Modal */}
            {playerOpen && media[currentMediaIndex] && (
                <div
                    className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center animate-fade-in"
                    onClick={closePlayer}
                >
                    <button
                        onClick={closePlayer}
                        className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full z-[70]"
                    >
                        <span className="material-symbols-outlined text-3xl">close</span>
                    </button>

                    <button
                        onClick={prevMedia}
                        className="absolute left-4 text-white p-4 hover:bg-white/10 rounded-full z-[70] hidden md:block"
                    >
                        <span className="material-symbols-outlined text-4xl">chevron_left</span>
                    </button>

                    <div
                        className="max-w-[90vw] max-h-[85vh] relative flex flex-col items-center"
                        onClick={e => e.stopPropagation()}
                    >
                        {media[currentMediaIndex].file_type === 'image' ? (
                            <img
                                src={getMediaUrl(media[currentMediaIndex])}
                                alt={media[currentMediaIndex].original_name}
                                className="max-w-full max-h-[80vh] object-contain shadow-2xl"
                            />
                        ) : (
                            <div className="w-[80vw] h-[80vh] bg-black flex items-center justify-center">
                                <video
                                    src={getMediaUrl(media[currentMediaIndex])}
                                    controls
                                    autoPlay
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}
                        <div className="mt-4 text-white text-center">
                            <h3 className="text-lg font-medium">{media[currentMediaIndex].original_name}</h3>
                            <p className="text-sm text-gray-400">
                                {currentMediaIndex + 1} de {media.length}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={nextMedia}
                        className="absolute right-4 text-white p-4 hover:bg-white/10 rounded-full z-[70] hidden md:block"
                    >
                        <span className="material-symbols-outlined text-4xl">chevron_right</span>
                    </button>
                </div>
            )}

            {/* Share Modal */}
            {isShareModalOpen && (
                <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center animate-fade-in">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Compartilhar Seleção</h3>
                            <button
                                onClick={() => setIsShareModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {!sharedLink ? (
                            <div className="space-y-4">
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
                                    <span className="material-symbols-outlined text-orange-600 text-sm">info</span>
                                    <p className="text-xs text-orange-800">
                                        Este álbum ficará oculto na galeria e só será acessível via link compartilhável.
                                    </p>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Criar link compartilhável com {selectedItems.size} itens selecionados.
                                </p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Álbum</label>
                                    <input
                                        type="text"
                                        value={albumName}
                                        onChange={(e) => setAlbumName(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Ex: Link para Cliente XYZ"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">\n                                    <button
                                    onClick={() => setIsShareModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                    <button
                                        onClick={confirmShare}
                                        disabled={creatingAlbum || !albumName.trim()}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {creatingAlbum && <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>}
                                        Criar Link
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3">
                                    <span className="material-symbols-outlined">check_circle</span>
                                    <p className="font-medium">Álbum criado com sucesso!</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Link de Compartilhamento</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={sharedLink}
                                            className="w-full rounded-lg border-gray-300 bg-gray-50 text-gray-600"
                                        />
                                        <button
                                            onClick={copyToClipboard}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 text-gray-700"
                                            title="Copiar"
                                        >
                                            <span className="material-symbols-outlined">content_copy</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-6">
                                    <button
                                        onClick={() => {
                                            setIsShareModalOpen(false);
                                            setSelectedItems(new Set()); // Clear selection after sharing
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Concluir
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Create Album Modal */}
            {isCreateAlbumModalOpen && (
                <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center animate-fade-in">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Criar Álbum</h3>
                            <button
                                onClick={() => setIsCreateAlbumModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Criar um álbum com {selectedItems.size} fotos selecionadas.
                            </p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Álbum</label>
                                <input
                                    type="text"
                                    value={albumName}
                                    onChange={(e) => setAlbumName(e.target.value)}
                                    className="w-full rounded-lg border-gray-300"
                                    placeholder="Ex: Ninhada A - 1 mês"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
                                <textarea
                                    value={albumDescription}
                                    onChange={(e) => setAlbumDescription(e.target.value)}
                                    className="w-full rounded-lg border-gray-300"
                                    rows="3"
                                    placeholder="Descrição do álbum..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setIsCreateAlbumModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmCreateAlbum}
                                    disabled={creatingAlbum || !albumName.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {creatingAlbum && <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>}
                                    Criar Álbum
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add to Album Modal */}
            {isAddToAlbumModalOpen && (
                <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center animate-fade-in">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Adicionar a Álbum</h3>
                            <button
                                onClick={() => setIsAddToAlbumModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Adicionar {selectedItems.size} fotos a um álbum existente.
                            </p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Selecione o Álbum</label>
                                <select
                                    value={selectedAlbumToAdd}
                                    onChange={(e) => setSelectedAlbumToAdd(e.target.value)}
                                    className="w-full rounded-lg border-gray-300"
                                >
                                    <option value="">Escolha um álbum...</option>
                                    {albums.filter(a => !a.is_hidden).map(album => (
                                        <option key={album.id} value={album.id}>
                                            {album.name} ({album.mediaFiles?.length || 0} fotos)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setIsAddToAlbumModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmAddToAlbum}
                                    disabled={!selectedAlbumToAdd}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Album Modal */}
            {isEditAlbumModalOpen && (
                <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center animate-fade-in">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">
                                Editar: {editingAlbum?.name}
                            </h3>
                            <button
                                onClick={() => setIsEditAlbumModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            Selecione fotos para adicionar ao álbum (atual: {editingAlbum?.mediaFiles?.length || 0} fotos)
                        </p>

                        {availableMedia.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-8">
                                Todas as fotos já estão neste álbum.
                            </p>
                        ) : (
                            <>
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    {availableMedia.map(item => (
                                        <div
                                            key={item.id}
                                            onClick={() => toggleMediaSelection(item.id)}
                                            className={`aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedMediaForAlbum.has(item.id) ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                        >
                                            <img
                                                src={getThumbnailUrl(item)}
                                                alt={item.original_name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t">
                                    <span className="text-sm text-gray-600">
                                        {selectedMediaForAlbum.size} fotos selecionadas
                                    </span>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsEditAlbumModalOpen(false)}
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={confirmAddPhotosToAlbum}
                                            disabled={selectedMediaForAlbum.size === 0}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            Adicionar Fotos
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
