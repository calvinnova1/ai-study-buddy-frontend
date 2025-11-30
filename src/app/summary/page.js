'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { summarizeText } from '@/services/api';

export default function SummaryPage() {
  const router = useRouter();
  const [uploadedText, setUploadedText] = useState('');
  const [fileName, setFileName] = useState('');
  const [summary, setSummary] = useState('');
  const [summaryType, setSummaryType] = useState('concise');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get uploaded text from sessionStorage
    const text = sessionStorage.getItem('uploadedText');
    const name = sessionStorage.getItem('fileName');

    if (!text) {
      router.push('/');
      return;
    }

    setUploadedText(text);
    setFileName(name || 'Uploaded file');
  }, [router]);

  // Generate summary
  const handleGenerateSummary = async () => {
    if (!uploadedText) {
      setError('No text available to summarize');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSummary('');

    const result = await summarizeText(uploadedText, summaryType);

    setIsGenerating(false);

    if (result.success) {
      setSummary(result.data.summary);
    } else {
      setError(result.error);
    }
  };

  // Copy summary to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download summary as text file
  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Summary Generator</h1>
        <p className="text-gray-600">Generate AI-powered summaries of your notes</p>
      </div>

      {/* File Info */}
      <div className="card mb-6">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <p className="font-medium text-gray-900">{fileName}</p>
            <p className="text-sm text-gray-600">{uploadedText.split(' ').length} words</p>
          </div>
        </div>
      </div>

      {/* Summary Type Selection */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Summary Type</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setSummaryType('concise')}
            className={`p-4 rounded-lg border-2 transition ${
              summaryType === 'concise'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <h3 className="font-semibold text-gray-900 mb-1">Concise</h3>
            <p className="text-sm text-gray-600">Brief 3-5 sentence summary</p>
          </button>

          <button
            onClick={() => setSummaryType('detailed')}
            className={`p-4 rounded-lg border-2 transition ${
              summaryType === 'detailed'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <h3 className="font-semibold text-gray-900 mb-1">Detailed</h3>
            <p className="text-sm text-gray-600">Comprehensive coverage of all points</p>
          </button>

          <button
            onClick={() => setSummaryType('bullet_points')}
            className={`p-4 rounded-lg border-2 transition ${
              summaryType === 'bullet_points'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <h3 className="font-semibold text-gray-900 mb-1">Bullet Points</h3>
            <p className="text-sm text-gray-600">Key ideas in list format</p>
          </button>
        </div>

        {/* Generate Button */}
        <div className="mt-6">
          <button
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <div className="spinner mr-2" style={{ width: '20px', height: '20px' }}></div>
                Generating Summary...
              </span>
            ) : (
              'Generate Summary'
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card mb-6 bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Summary Display */}
      {summary && (
        <div className="card fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Summary</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleCopy}
                className="btn-secondary text-sm px-4 py-2"
                title="Copy to clipboard"
              >
                {copied ? (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </span>
                )}
              </button>

              <button
                onClick={handleDownload}
                className="btn-secondary text-sm px-4 py-2"
                title="Download as text file"
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </span>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{summary}</p>
          </div>

          {/* Summary Stats */}
          <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="badge badge-blue mr-2">Summary Type</span>
              <span className="capitalize">{summaryType.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center">
              <span className="badge badge-green mr-2">Words</span>
              <span>{summary.split(' ').length}</span>
            </div>
          </div>

          {/* Generate Another */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setSummary('')}
              className="btn-secondary"
            >
              Generate Another Summary
            </button>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => router.push('/')}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Upload
        </button>
      </div>
    </div>
  );
}