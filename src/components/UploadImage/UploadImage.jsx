import { useState, useRef } from 'react';
import { nhost } from '../../nhost';

import { useTranslation } from '../../hooks/useTranslation';
import Button from '../Button/Button';
import Alert from '../Alert/Alert';
import './UploadImage.css';

export default function UploadImage({ value = [], onChange, label }) {
    const t = useTranslation();
    const [images, setImages] = useState(value);
    const [alert, setAlert] = useState(null)
    const dragItemIndex = useRef(null);
    const dragOverItemIndex = useRef(null);

    const updateImages = (newImages) => {
        setImages(newImages);
        if (onChange) {
            onChange(newImages);
        }
    };

    const handleImageRemove = async (index) => {
        const imageUrl = images[index];
        const fileId = imageUrl.split('/').pop();

        try {
            await nhost.storage.delete({ fileId });
            const updated = [...images];
            updated.splice(index, 1);
            updateImages(updated);
        } catch (error) {
            console.error(t('alert_error_upload_image_1'), error);
            setAlert({ type: 'error', message: t('alert_error_upload_image_1') });
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const uploadedUrls = [];
        for (const file of files) {
            const result = await nhost.storage.upload({ file });
            if (result.fileMetadata) {
                const publicUrl = nhost.storage.getPublicUrl({ fileId: result.fileMetadata.id });
                uploadedUrls.push(publicUrl);
            } else {
                setAlert({ type: 'error', message: (t('alert_error_upload_image_2') + file.name) });
            }
        }

        updateImages([...images, ...uploadedUrls]);
        e.target.value = null;
    };

    const handleDragStart = (index) => {
        dragItemIndex.current = index;
    };

    const handleDragEnter = (index) => {
        dragOverItemIndex.current = index;
        const newImages = [...images];
        const draggedItemContent = newImages[dragItemIndex.current];
        newImages.splice(dragItemIndex.current, 1);
        newImages.splice(dragOverItemIndex.current, 0, draggedItemContent);
        dragItemIndex.current = dragOverItemIndex.current;
        dragOverItemIndex.current = null;
        updateImages(newImages);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        const dtFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (dtFiles.length === 0) return;

        const uploadedUrls = [];
        for (const file of dtFiles) {
            const result = await nhost.storage.upload({ file });
            if (result.fileMetadata) {
                const publicUrl = nhost.storage.getPublicUrl({ fileId: result.fileMetadata.id });
                uploadedUrls.push(publicUrl);
            } else {
                setAlert({ type: 'error', message: (t('alert_error_upload_image_2') + file.name) });
            }
        }
        updateImages([...images, ...uploadedUrls]);
    };

    return (
        <label className="label-upload-image">{label}
            <div
                className="div-upload-image-dropzone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('fileInput').click()}
            >
                {t('upload_image')}
            </div>

            <div className="div-upload-image-preview-container">
                {images.map((url, index) => (
                    <div
                        key={url}
                        className="div-upload-image-item"
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragOver={handleDragOver}
                        title="Drag to sort"
                    >
                        <img
                            src={url}
                            alt={`img-${index}`}
                            className="img-upload-image"
                        />
                        <Button
                            className="button-upload-image-remove"
                            onClick={() => handleImageRemove(index)}
                            aria-label={`Remove img ${index + 1}`}
                        >
                            ×
                        </Button>
                    </div>
                ))}
            </div>

            <input
                id="fileInput"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />
            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
        </label>
    );
}