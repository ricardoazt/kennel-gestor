import React from 'react';
import './UploadProgress.css';

const UploadProgress = ({ uploadQueue, onCancel, onClose }) => {
    if (!uploadQueue || uploadQueue.length === 0) return null;

    const completedCount = uploadQueue.filter(item => item.status === 'completed').length;
    const totalCount = uploadQueue.length;
    const allCompleted = completedCount === totalCount;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return '✓';
            case 'error':
                return '✗';
            case 'cancelled':
                return '⊘';
            default:
                return '';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed':
                return 'upload-item-completed';
            case 'error':
                return 'upload-item-error';
            case 'cancelled':
                return 'upload-item-cancelled';
            case 'uploading':
                return 'upload-item-uploading';
            default:
                return 'upload-item-pending';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="upload-progress-overlay">
            <div className="upload-progress-modal">
                <div className="upload-progress-header">
                    <div className="upload-progress-title">
                        <span className="material-symbols-outlined">upload_file</span>
                        <span>Enviando Arquivos ({completedCount}/{totalCount})</span>
                    </div>
                    {allCompleted && (
                        <button
                            className="upload-progress-close"
                            onClick={onClose}
                            title="Fechar"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    )}
                </div>

                <div className="upload-progress-body">
                    {uploadQueue.map((item) => (
                        <div key={item.id} className={`upload-item ${getStatusClass(item.status)}`}>
                            <div className="upload-item-header">
                                <div className="upload-item-info">
                                    <span className="upload-item-name">{item.file.name}</span>
                                    <span className="upload-item-size">{formatFileSize(item.file.size)}</span>
                                </div>
                                <div className="upload-item-actions">
                                    {item.status === 'uploading' && (
                                        <button
                                            className="upload-cancel-btn"
                                            onClick={() => onCancel(item.id)}
                                            title="Cancelar"
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                        </button>
                                    )}
                                    {(item.status === 'completed' || item.status === 'error' || item.status === 'cancelled') && (
                                        <span className="upload-status-icon">{getStatusIcon(item.status)}</span>
                                    )}
                                </div>
                            </div>

                            {item.status === 'uploading' && (
                                <div className="upload-progress-bar-container">
                                    <div
                                        className="upload-progress-bar"
                                        style={{ width: `${item.progress}%` }}
                                    />
                                    <span className="upload-progress-text">{item.progress}%</span>
                                </div>
                            )}

                            {item.status === 'pending' && (
                                <div className="upload-status-text">Aguardando...</div>
                            )}

                            {item.status === 'error' && (
                                <div className="upload-status-text upload-error-text">
                                    Erro ao enviar arquivo
                                </div>
                            )}

                            {item.status === 'cancelled' && (
                                <div className="upload-status-text upload-cancelled-text">
                                    Upload cancelado
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {allCompleted && (
                    <div className="upload-progress-footer">
                        <span className="upload-complete-message">
                            ✓ Todos os arquivos foram enviados!
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadProgress;
