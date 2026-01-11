import React, {useEffect, useRef, useState} from 'react';
import { getFile, updateFile, trashItem, renameItem, starItem } from '../PopupLogic.js';
import docsLogo from '../../../../assets/docs.png';
import InputNamePopup from "../InputNamePopup/InputNamePopup.jsx";
import pdfLogo from '../../../../assets/pdf.png';
import imageLogo from '../../../../assets/image.png';
import txtLogo from '../../../../assets/txt.png';
import './FilePreviewPopup.css';

const FilePreviewPopup =  ({ file, isOpen, setIsOpen, onActionComplete }) => {
    const [fileContent, setFileContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [isStarred, setIsStarred] = useState(!!file?.starred);
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

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
        if (isRenameOpen || isEditOpen) return;
        timeoutRef.current = setTimeout(() => {
            setShowUI(false);
        }, 2500);
    };

    useEffect(() => {
        const fetchContent = async () => {
            if (isOpen && file && file?.id) {
                setLoading(true);
                try {
                    const data = await getFile(file?.id);
                    setFileContent(String(data.content));

                    const currentUserId = sessionStorage.getItem("id");

                    const isUserStarred = Array.isArray(data.starred)
                        ? data.starred.includes(currentUserId)
                        : !!data.starred;

                    setIsStarred(isUserStarred);

                } catch (error) {
                    console.error("Failed to fetch file:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        void fetchContent();
    }, [file?.id, isOpen]);

    useEffect(() => {
        if (isRenameOpen || isEditOpen) {
            setShowUI(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            setTimeout(() => {
                const inputElement = document.querySelector('.rename-context-wrapper .input-name-input, .edit-context-wrapper .input-name-input');
                if (inputElement) {
                    inputElement.value = isEditOpen ? fileContent : file?.name;

                    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                    inputElement.focus();
                    inputElement.select();
                }
            }, 50);
        } else {
            resetTimer();
        }
    }, [isRenameOpen, isEditOpen, file?.name, fileContent]);

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

    const extension = file?.name.split('.').pop().toLowerCase();

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

    const onEditText = async (newText) => {
        try {
            await updateFile(file.id, { content: newText });
            setFileContent(newText);
            if (onActionComplete) onActionComplete();
            setIsEditOpen(false);
        } catch (error) {
            console.error("Failed to edit text:", error);
        }
    };

    const handleSwapImage = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';

        fileInput.onchange = async (e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const base64Image = event.target?.result;
                    if (typeof base64Image === 'string') {
                        try {
                            await updateFile(file.id, { content: base64Image });

                            setFileContent(base64Image);
                            if (onActionComplete) onActionComplete();
                        } catch (error) {
                            console.error("Error swapping image:", error);
                        }
                    }
                };
                reader.readAsDataURL(selectedFile);
            }
        };
        fileInput.click();
    };

    const handleTrash = async () => {
        try {
            await trashItem(file?.id, true);
            if (onActionComplete) onActionComplete();
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to move item to trash:", error);
        }
    };
    const onRenameItem = async (newName) => {
        if (!newName || newName === file?.name) {
            setIsRenameOpen(false);
            return;
        }

        try {
            await renameItem(file?.id, newName);
            if (onActionComplete) onActionComplete();
            setIsRenameOpen(false);
        } catch (error) {
            console.error("Rename failed", error);
        }
    };

    const handleStar = async () => {
        const nextState = !isStarred;

        try {
            await starItem(file?.id, nextState);
            setIsStarred(nextState);
            file.starred = nextState;
            if (onActionComplete) onActionComplete();

        } catch (error) {
            console.error("Failed to toggle star:", error);
        }
    };

    const handleDownload = async () => {
        if (!fileContent) {
            alert("File content is not loaded yet.");
            return;
        }

        try {
            const response = await fetch(fileContent);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', file?.name || 'download');

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            window.open(fileContent, '_blank');
        }
    };

    const handleZoom = (e, type) => {
        e.stopPropagation();
        if (type === 'in') setZoomLevel(prev => Math.min(prev + 5, 50));
        if (type === 'out') setZoomLevel(prev => Math.max(prev - 5, 10));
        if (type === 'reset') setZoomLevel(14);
    };

    const renderContent = () => {
        if (loading) return <div className="unsupported-msg">Loading...</div>;
        if (!fileContent) return <div className="unsupported-msg">No content found</div>;

        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
        if (isImage) {
            return (
                <div className="image-viewer-container">
                    <img
                        src={fileContent}
                        alt={file?.name}
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
                        src={`${fileContent}#toolbar=0&navpanes=0`}
                        title={file?.name}
                        className="pdf-display"
                    />
                </div>
            );
        }
        if (extension === 'txt') {
            return (
                <div className="google-text-viewer">
                    <pre className="text-body" style={{ fontSize: `${zoomLevel}px` }}>
                        {fileContent || ""}
                    </pre>
                </div>
            );
        }
        return <div className="unsupported-msg">No preview available</div>;
    };

    const isPDF = extension === 'pdf';
    const isTXT = extension === 'txt';

    return (
        <div
            className={`google-preview-overlay ${isPDF ? 'no-scroll' : ''}`}
            ref={overlayRef}
            onScroll={handleScroll}
            onMouseMove={resetTimer}
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
                    <span className="file-title-white">{file?.name}</span>
                </div>

                <div className="toolbar-right">
                    {!isPDF && (
                        <div className="edit-action-wrapper" style={{ display: 'inline-block', position: 'relative' }}>
                            <button
                                className="icon-btn-white"
                                onClick={isTXT ? () => setIsEditOpen(!isEditOpen) : handleSwapImage}
                            >
                            <span className="material-symbols-outlined">
                                {isTXT ? 'edit' : 'published_with_changes'}
                            </span>
                                <span className="tooltip-text">
                                {isTXT ? 'Edit text' : 'Swap image'}
                            </span>
                            </button>

                            {isEditOpen && (
                                <div className="edit-context-wrapper">
                                    <InputNamePopup
                                        toggle={() => setIsEditOpen(false)}
                                        onDone={onEditText}
                                        doneText="Save"
                                        title="Edit Text"
                                        currentName={fileContent}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <div className="rename-container" style={{ display: 'inline-block', position: 'relative' }}>
                        <button className="icon-btn-white" onClick={() => setIsRenameOpen(!isRenameOpen)}>
                            <span className="material-symbols-outlined">drive_file_rename_outline</span>
                            <span className="tooltip-text">Rename</span>
                        </button>

                        {isRenameOpen && (
                            <div className="rename-context-wrapper">
                                <InputNamePopup
                                    toggle={() => setIsRenameOpen(false)}
                                    onDone={onRenameItem}
                                    doneText="Ok"
                                    title="Rename"
                                    currentName={file.name}
                                />
                            </div>
                        )}
                    </div>

                    <button className="icon-btn-white" onClick={handleStar}>
                    <span
                        className="material-symbols-outlined"
                        style={{
                            fontVariationSettings: isStarred ? "'FILL' 1" : "'FILL' 0",
                            transition: 'font-variation-settings 0.2s ease'
                        }}
                    >
                        star
                    </span>
                        <span className="tooltip-text">
                        {isStarred ? 'Remove from starred' : 'Add to starred'}
                    </span>
                    </button>

                    <button className="icon-btn-white" onClick={handleTrash}>
                        <span className="material-symbols-outlined">delete</span>
                        <span className="tooltip-text">Move to trash</span>
                    </button>

                    <button className="icon-btn-white">
                        <span className="material-symbols-outlined">drive_file_move</span>
                        <span className="tooltip-text">Move to</span>
                    </button>

                    <div className="toolbar-divider"></div>

                    <button className="icon-btn-white" onClick={handleDownload}>
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
                            <div ref={contentRef}
                                 style={{
                                     width: isPDF ? '90vw' : (extension === 'txt' ? '1050px' : 'fit-content'),
                                     maxWidth: '1000px',
                                     margin: '0 auto'
                                 }}
                            >
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