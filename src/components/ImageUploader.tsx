import React, { useState } from 'react';
import './ImageUploader.css';

interface ImageUploaderProps {
  onImageUploaded?: (imageUrl: string, filename: string) => void;
  category: 'disc-bases' | 'templates' | 'uploaded';
  accept?: string;
  maxSize?: number; // in MB
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  category,
  accept = 'image/*',
  maxSize = 5
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', category);

      // For now, we'll simulate upload by creating a local URL
      // In a real app, you'd upload to a server
      const imageUrl = URL.createObjectURL(file);
      
      if (onImageUploaded) {
        onImageUploaded(imageUrl, file.name);
      }

      console.log(`Image uploaded to ${category}:`, file.name);
      
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const getCategoryDescription = () => {
    switch (category) {
      case 'disc-bases':
        return 'Base disc images (300x300px PNG recommended)';
      case 'templates':
        return 'Reference images for AI generation';
      case 'uploaded':
        return 'User-uploaded images';
      default:
        return 'Upload images';
    }
  };

  return (
    <div className="image-uploader">
      <div className="upload-header">
        <h3>📁 Upload to {category.replace('-', ' ')}</h3>
        <p>{getCategoryDescription()}</p>
      </div>

      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="file-input"
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="upload-content">
            <div className="upload-spinner"></div>
            <p>Uploading...</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📤</div>
            <p>Drop images here or click to browse</p>
            <p className="upload-hint">
              Max size: {maxSize}MB • Formats: JPG, PNG, WebP
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="upload-error">
          ❌ {error}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
