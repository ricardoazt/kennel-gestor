import React, { useState, useEffect } from 'react';
import { getMedia, uploadMedia, deleteMedia } from '../../services/mediaService';

const Gallery = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [filter, setFilter] = useState('all'); // all, image, video

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
        // FORCE URL to 3000
        const baseUrl = 'http://localhost:3000';
        return `${baseUrl}/uploads/media/${mediaItem.filename}`;
    };

    const getThumbnailUrl = (mediaItem) => {
        // FORCE URL to 3000
        const baseUrl = 'http://localhost:3000';
        if (mediaItem.thumbnail_path) {
            return `${baseUrl}/uploads/media/${mediaItem.thumbnail_path}`;
        }
        return getMediaUrl(mediaItem);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Galeria de Mídia</h1>
                    <p className="mt-2 text-gray-600">Gerencie fotos e vídeos do canil</p>
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
                    {media.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden group relative">
                            {/* Media Preview */}
                            <div className="aspect-square bg-gray-100 relative">
                                {item.file_type === 'image' ? (
                                    <img
                                        src={getThumbnailUrl(item)}
                                        alt={item.original_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-6xl text-gray-400">videocam</span>
                                    </div>
                                )}

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 mx-1"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                    <a
                                        href={getMediaUrl(item)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-1"
                                    >
                                        <span className="material-symbols-outlined">open_in_new</span>
                                    </a>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-3">
                                <p className="text-sm font-medium text-gray-900 truncate">{item.original_name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {item.file_type === 'image' && item.width && `${item.width}x${item.height}`}
                                    {item.file_size && ` • ${(item.file_size / 1024 / 1024).toFixed(2)} MB`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Debug Info */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-500">
                <p><strong>Debug Info:</strong></p>
                <p>API URL: {import.meta.env.VITE_API_URL || 'http://localhost:3000'}</p>
                <p>Environment: {import.meta.env.MODE}</p>
            </div>
        </div>
    );
};

export default Gallery;
