'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadFile, validateFile, formatFileSize } from '@/services/api';
// 1. Import the Chat Component
import ChatInterface from '../components/ChatInterface';

export default function HomePage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedText, setUploadedText] = useState('');
  // 2. Add State for Chat visibility
  const [showChat, setShowChat] = useState(false);

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

  // Upload file to backend
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError('');

    const result = await uploadFile(file);

    setIsUploading(false);

    if (result.success) {
      setUploadedText(result.data.text_content);
      // Store in sessionStorage for other pages to access
      sessionStorage.setItem('uploadedText', result.data.text_content);
      sessionStorage.setItem('fileName', result.data.filename);
      
      // Show success and redirect options
      alert('File uploaded successfully! Choose an action below.');
    } else {
      setError(result.error);
    }
  };

  // Navigate to summary page
  const goToSummary = () => {
    if (!uploadedText) {
      setError('Please upload a file first');
      return;
    }
    router.push('/summary');
  };

  // Navigate to quiz page
  const goToQuiz = () => {
    if (!uploadedText) {
      setError('Please upload a file first');
      return;
    }
    router.push('/quiz');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Welcome to AI Study Buddy
        </h1>
        <p className="text-lg text-gray-600">
          Upload your notes and let AI help you study smarter
        </p>
      </div>

      {/* Upload Section */}
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Upload Your Notes
        </h2>

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
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
                onClick={() => setFile(null)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Upload Button */}
        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
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
      </div>

      {/* Action Buttons - Show after upload */}
      {uploadedText && (
        <div className="card fade-in">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            What would you like to do?
          </h2>
          
          {/* 3. Updated Button Grid to include Chat */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={goToSummary}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Generate Summary</span>
            </button>

            <button
              onClick={goToQuiz}
              className="btn-success flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Generate Quiz</span>
            </button>

            {/* New Chat Button */}
            <button
              onClick={() => setShowChat(!showChat)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Chat with PDF</span>
            </button>
          </div>

          {/* 4. Chat Interface Display */}
          {showChat && (
            <div className="mt-6 animate-fade-in">
              <ChatInterface documentText={uploadedText} />
            </div>
          )}
        </div>
      )}

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Fast Processing</h3>
          <p className="text-sm text-gray-600">AI-powered summarization in seconds</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Smart Quizzes</h3>
          <p className="text-sm text-gray-600">Auto-generated questions to test your knowledge</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
          <p className="text-sm text-gray-600">Monitor your learning journey over time</p>
        </div>
      </div>
    </div>
  );
}