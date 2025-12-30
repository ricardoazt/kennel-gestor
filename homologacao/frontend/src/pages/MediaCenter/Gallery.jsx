import React, { useState, useEffect } from 'react';
import { getMedia, uploadMedia, deleteMedia } from '../../services/mediaService';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Gallery = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [filter, setFilter] = useState('all'); // all, image, video

    // Selection State
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    // Player State
    const [playerOpen, setPlayerOpen] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    useEffect(() => {
        loadMedia();
    }, [filter]);

    const loadMedia = async () => {
        try {
            setLoading(true);
            const filters = filter !== 'all' ? { file_type: filter } : {};
            const response = await getMedia(filters);
            setMedia(response.media || []);
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
        if (!confirm('Tem certeza que deseja excluir esta mídia?')) return;

        try {
            await deleteMedia(id);
            await loadMedia();
        } catch (error) {
            console.error('Error deleting media:', error);
            alert('Erro ao excluir mídia');
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
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter('image')}
                        className={`px-4 py-2 rounded-lg ${filter === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <span className="material-symbols-outlined align-middle mr-1">image</span>
                        Fotos
                    </button>
                    <button
                        onClick={() => setFilter('video')}
                        className={`px-4 py-2 rounded-lg ${filter === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <span className="material-symbols-outlined align-middle mr-1">videocam</span>
                        Vídeos
                    </button>
                </div>
            </div>

            {/* Gallery Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Carregando...</p>
                </div>
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
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
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
                        <button
                            onClick={handleDownloadZip}
                            className="p-2 hover:bg-gray-800 rounded-full transition-colors tooltip flex flex-col items-center gap-1 group"
                        >
                            <span className="material-symbols-outlined">download</span>
                            <span className="text-[10px] hidden group-hover:block absolute -top-8 bg-black px-2 py-1 rounded">Baixar ZIP</span>
                        </button>

                        <button
                            className="p-2 hover:bg-gray-800 rounded-full transition-colors tooltip flex flex-col items-center gap-1 group"
                            onClick={() => alert('Em breve: Compartilhamento público')}
                        >
                            <span className="material-symbols-outlined">share</span>
                            <span className="text-[10px] hidden group-hover:block absolute -top-8 bg-black px-2 py-1 rounded">Compartilhar</span>
                        </button>

                        <div className="w-px h-8 bg-gray-700 mx-2"></div>

                        <button
                            onClick={handleBulkDelete}
                            className="p-2 hover:bg-red-900/50 text-red-400 rounded-full transition-colors flex flex-col items-center gap-1 group"
                        >
                            <span className="material-symbols-outlined">delete</span>
                            <span className="text-[10px] hidden group-hover:block absolute -top-8 bg-black px-2 py-1 rounded">Excluir</span>
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
        </div>
    );
};

export default Gallery;
