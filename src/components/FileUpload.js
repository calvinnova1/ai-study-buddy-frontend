'use client';

import { useState } from 'react';
import { validateFile, formatFileSize } from '@/services/api';

export default function FileUpload({ onFileSelect, onUpload, isUploading }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  // Process and validate file
  const processFile = (selectedFile) => {
    setError('');
    
    const validation = validateFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    
    setFile(selectedFile);
    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  // Remove selected file
  const handleRemove = () => {
    setFile(null);
    setError('');
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  // Handle upload
  const handleUploadClick = () => {
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <div className="w-full">
      {/* Drag & Drop Zone */}
      <div
        className={`drag-zone ${isDragging ? 'drag-active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          
          <p className="text-gray-700 font-medium mb-2">
            Drag and drop your file here, or
          </p>
          
          <label className="btn-primary cursor-pointer">
            Browse Files
            <input
              type="file"
              className="hidden"
              accept=".txt,.pdf,.docx"
              onChange={handleFileChange}
            />
          </label>
          
          <p className="text-sm text-gray-500 mt-3">
            Supported formats: TXT, PDF, DOCX (Max 10MB)
          </p>
        </div>
      </div>

      {/* Selected File Display */}
      {file && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="text-red-600 hover:text-red-800 transition"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {file && onUpload && (
        <div className="mt-4">
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <span className="flex items-center justify-center">
                <div className="spinner mr-2" style={{ width: '20px', height: '20px' }}></div>
                Uploading...
              </span>
            ) : (
              'Upload and Process'
            )}
          </button>
        </div>
      )}
    </div>
  );
}