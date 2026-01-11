import React, {useEffect, useRef, useState} from 'react';
import { outsideClickListener } from '../PopupLogic';
import docsLogo from '../../../../assets/docs.png';
import pdfLogo from '../../../../assets/pdf.png';
import imageLogo from '../../../../assets/image.png';
import txtLogo from '../../../../assets/txt.png';
import './FilePreviewPopup.css';

const FilePreviewPopup = ({ file, isOpen, setIsOpen }) => {
    const toolbarRef = useRef(null);
    const contentRef = useRef(null);
    const zoomBarRef = useRef(null);

    const overlayRef = useRef(null);
    const timeoutRef = useRef(null);
    const [showUI, setShowUI] = useState(true);
    const [zoomLevel, setZoomLevel] = useState(14);
    const [bgOpacity, setBgOpacity] = useState(0);

    const resetTimer = () => {
        setShowUI(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            setShowUI(false);
        }, 2500);
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('mousemove', resetTimer);
            resetTimer();
        }
        return () => {
            window.removeEventListener('mousemove', resetTimer);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!isOpen) return;

            const clickedInToolbar = toolbarRef.current?.contains(event.target);
            const clickedInContent = contentRef.current?.contains(event.target);
            const clickedInZoomBar = zoomBarRef.current?.contains(event.target);

            if (!clickedInToolbar && !clickedInContent && !clickedInZoomBar) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, file]);

    const handleScroll = (e) => {
        resetTimer();
        const scrollTop = e.target.scrollTop;
        setBgOpacity(scrollTop > 0 ? 1 : 0);
    };

    if (!isOpen || !file) return null;

    const extension = file.name.split('.').pop().toLowerCase();

    const logoMap = {
        'txt': txtLogo,
        'doc': docsLogo,
        'docx': docsLogo,
        'pdf': pdfLogo,
        'jpg': imageLogo,
        'png': imageLogo,
        'jpeg': imageLogo
    };

    const fileIcon = logoMap[extension] || txtLogo;

    const handleClose = () => {
        setZoomLevel(14);
        setIsOpen(false);
    };

    const handleZoom = (e, type) => {
        e.stopPropagation();
        if (type === 'in') setZoomLevel(prev => Math.min(prev + 5, 50));
        if (type === 'out') setZoomLevel(prev => Math.max(prev - 5, 10));
        if (type === 'reset') setZoomLevel(14);
    };

    const renderContent = () => {
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);

        if (isImage) {
            return (
                <div className="image-viewer-container">
                    <img
                        src={file.content}
                        alt={file.name}
                        className="preview-image dynamic-zoom"
                        style={{
                            transform: `scale(${zoomLevel / 14})`,
                            transition: 'transform 0.2s ease-out'
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'path/to/fallback-image.png';
                        }}
                    />
                </div>
            );
        }
        if (extension === 'pdf') {
            return (
                <div className="pdf-viewer-container">
                    <iframe
                        src={`${file.content}#toolbar=0&navpanes=0`}
                        title={file.name}
                        className="pdf-display"
                    />
                </div>
            );
        }
        if (extension === 'txt') {
            return (
                <div className="google-text-viewer">
                    <pre className="text-body" style={{ fontSize: `${zoomLevel}px` }}>
                        {file.content || ""}
                    </pre>
                </div>
            );
        }
        return <div className="unsupported-msg">No preview available</div>;
    };

    const isPDF = extension === 'pdf';
    return (
        <div
            className={`google-preview-overlay ${isPDF ? 'no-scroll' : ''}`}
            ref={overlayRef}
            onScroll={handleScroll}
        >
            <div
                ref={toolbarRef}
                className={`preview-toolbar ${!showUI ? 'ui-hidden' : ''}`}
                onClick={(e) => e.stopPropagation()}
                style={{ backgroundColor: bgOpacity > 0 ? `rgba(32, 33, 36, ${bgOpacity})` : 'transparent' }}
            >
                <div className="toolbar-left">
                    <button className="close-circle-btn" onClick={handleClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <img src={fileIcon} alt="file type" className="file-type-icon" />
                    <span className="file-title-white">{file.name}</span>
                </div>
                <div className="toolbar-right">
                    {!isPDF && (
                        <button className="icon-btn-white">
                            <span className="material-symbols-outlined">edit</span>
                            <span className="tooltip-text">Edit text</span>
                        </button>
                    )}
                    <button className="icon-btn-white">
                        <span className="material-symbols-outlined">drive_file_rename_outline</span>
                        <span className="tooltip-text">Rename</span>
                    </button>
                    <button className="icon-btn-white">
                        <span className="material-symbols-outlined">delete</span>
                        <span className="tooltip-text">Delete</span>
                    </button>
                    <button className="icon-btn-white">
                        <span className="material-symbols-outlined">drive_file_move</span>
                        <span className="tooltip-text">Move to</span>
                    </button>

                    <div className="toolbar-divider"></div>

                    <button className="icon-btn-white">
                        <span className="material-symbols-outlined">download</span>
                        <span className="tooltip-text">Download</span>
                    </button>
                </div>
            </div>

            <div className="protected-center-column">
                <div className="preview-content-container">
                    {isPDF ? (
                        <div className="pdf-fixed-container" ref={contentRef}>
                            {renderContent()}
                        </div>
                    ) : (
                        <div className="scroll-content-wrapper">
                            <div ref={contentRef} style={{ width: 'fit-content' }}>
                                {renderContent()}
                            </div>
                        </div>
                    )}
                </div>

                <div
                    ref={zoomBarRef}
                    className={`zoom-floating-bar-wrapper ${!showUI ? 'ui-hidden' : ''}`}
                >
                    {!isPDF && (
                        <div className="zoom-floating-bar" onClick={(e) => e.stopPropagation()}>
                            <button className="zoom-icon-btn" onClick={(e) => handleZoom(e, 'in')}>+</button>
                            <div className="zoom-divider"></div>
                            <button className="zoom-icon-btn reset-text" onClick={(e) => handleZoom(e, 'reset')}>
                                <span className="material-symbols-outlined reset-icon">search_check</span>
                            </button>
                            <div className="zoom-divider"></div>
                            <button className="zoom-icon-btn" onClick={(e) => handleZoom(e, 'out')}>−</button>
                        </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default FilePreviewPopup;