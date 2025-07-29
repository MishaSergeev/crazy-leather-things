import { useState, useRef } from 'react';
import { nhost } from '../../nhost';

import { useTranslation } from '../hooks/useTranslation';
import Button from '../Button/Button';

export default function UploadImage({ value = [], onChange }) {
      const t = useTranslation();
    const [images, setImages] = useState(value);
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
            console.error('Ошибка при удалении файла:', error);
            alert('Не удалось удалить изображение из хранилища.');
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
                alert('Ошибка загрузки файла: ' + file.name);
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
                alert('Ошибка загрузки файла: ' + file.name);
            }
        }
        updateImages([...images, ...uploadedUrls]);
    };

    return (
        <div>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                    border: '2px dashed #aaa',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center',
                    color: '#555',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                }}
                onClick={() => document.getElementById('fileInput').click()}
            >
                {t('upload_image')}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {images.map((url, index) => (
                    <div
                        key={url}
                        style={{ position: 'relative', cursor: 'grab' }}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragOver={handleDragOver}
                        title="Drag to sort"
                    >
                        <img
                            src={url}
                            alt={`img-${index}`}
                            style={{ width: '120px', height: 'auto', borderRadius: '8px', display: 'block' }}
                        />
                        <Button
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '20%',
                                lineHeight: 1,
                            }}
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
        </div>
    );
}