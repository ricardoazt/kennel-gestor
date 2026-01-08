import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import './MediaViewer.css';

const MediaViewer = ({
    isOpen,
    mediaItems,
    currentIndex,
    onClose,
    onNext,
    onPrev
}) => {
    const [direction, setDirection] = useState('none');
    const [isAnimating, setIsAnimating] = useState(false);
    const prevIndexRef = useRef(currentIndex);
    const isFirstRenderRef = useRef(true);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowRight' && !isAnimating) {
                handleNext();
            } else if (e.key === 'ArrowLeft' && !isAnimating) {
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isAnimating, currentIndex]);

    // Prevent body scroll when viewer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            isFirstRenderRef.current = true;
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleNext = () => {
        if (isAnimating) return;
        isFirstRenderRef.current = false;
        setDirection('left');
        setIsAnimating(true);
        setTimeout(() => {
            onNext();
            setIsAnimating(false);
        }, 350);
    };

    const handlePrev = () => {
        if (isAnimating) return;
        isFirstRenderRef.current = false;
        setDirection('right');
        setIsAnimating(true);
        setTimeout(() => {
            onPrev();
            setIsAnimating(false);
        }, 350);
    };

    if (!isOpen || !mediaItems || !mediaItems[currentIndex]) return null;

    const currentMedia = mediaItems[currentIndex];
    const getMediaUrl = (item) => {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        return `${baseUrl}/uploads/media/${item.filename}`;
    };

    const viewerContent = (
        <div
            className={`media-viewer-overlay ${isOpen ? 'active' : ''}`}
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="media-viewer-close"
                aria-label="Fechar"
            >
                <span className="material-symbols-outlined">close</span>
            </button>

            {/* Previous Button */}
            {mediaItems.length > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                    }}
                    className="media-viewer-nav media-viewer-prev"
                    aria-label="Anterior"
                    disabled={isAnimating}
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
            )}

            {/* Media Container */}
            <div
                className="media-viewer-container"
                onClick={e => e.stopPropagation()}
            >
                <div className={`media-viewer-content ${direction} ${isAnimating ? 'animating' : ''} ${isFirstRenderRef.current ? 'first-render' : ''}`}>
                    {currentMedia.file_type === 'image' ? (
                        <img
                            src={getMediaUrl(currentMedia)}
                            alt={currentMedia.original_name}
                            className="media-viewer-image"
                        />
                    ) : (
                        <video
                            src={getMediaUrl(currentMedia)}
                            controls
                            autoPlay
                            className="media-viewer-video"
                        />
                    )}
                </div>

                {/* Media Info */}
                <div className="media-viewer-info">
                    <h3 className="media-viewer-title">{currentMedia.original_name}</h3>
                    <p className="media-viewer-counter">
                        {currentIndex + 1} de {mediaItems.length}
                    </p>
                </div>
            </div>

            {/* Next Button */}
            {mediaItems.length > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                    }}
                    className="media-viewer-nav media-viewer-next"
                    aria-label="Próximo"
                    disabled={isAnimating}
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            )}
        </div>
    );

    // Render in a portal attached to document.body
    return createPortal(viewerContent, document.body);
};

export default MediaViewer;
