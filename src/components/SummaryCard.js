'use client';

import { useState } from 'react';

export default function SummaryCard({ summary, summaryType, fileName }) {
  const [copied, setCopied] = useState(false);

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
    a.download = `${fileName || 'summary'}_${summaryType}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Share summary (if Web Share API is available)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Study Buddy Summary',
          text: summary,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      handleCopy();
    }
  };

  const wordCount = summary.split(' ').length;

  return (
    <div className="card fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900">Your Summary</h2>
        </div>

        {/* Action Buttons */}
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

          <button
            onClick={handleShare}
            className="btn-secondary text-sm px-4 py-2"
            title="Share summary"
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </span>
          </button>
        </div>
      </div>

      {/* Summary Content */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{summary}</p>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center">
          <span className="badge badge-blue mr-2">Summary Type</span>
          <span className="text-gray-700 capitalize">{summaryType.replace('_', ' ')}</span>
        </div>
        <div className="flex items-center">
          <span className="badge badge-green mr-2">Words</span>
          <span className="text-gray-700">{wordCount}</span>
        </div>
        <div className="flex items-center">
          <span className="badge badge-purple mr-2">Characters</span>
          <span className="text-gray-700">{summary.length}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Generated by AI Study Buddy
          </p>
          
          {fileName && (
            <p className="text-sm text-gray-600">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {fileName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}