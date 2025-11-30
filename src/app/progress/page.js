'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProgress, getUserId } from '@/services/api';

export default function ProgressPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    setIsLoading(true);
    setError('');

    const userId = getUserId();
    if (!userId) {
      setError('User ID not found');
      setIsLoading(false);
      return;
    }

    const result = await getUserProgress(userId);

    setIsLoading(false);

    if (result.success) {
      setProgress(result.data);
    } else {
      setError(result.error);
    }
  };

  // Get performance level based on average score
  const getPerformanceLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 60) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 40) return { level: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="spinner"></div>
          <span className="ml-3 text-gray-600">Loading your progress...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const performance = progress ? getPerformanceLevel(progress.average_score) : null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
        <p className="text-gray-600">Track your learning journey and achievements</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Notes */}
        <div className="card-hover">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{progress?.total_notes || 0}</p>
          <p className="text-sm text-gray-600 mt-1">Notes Uploaded</p>
        </div>

        {/* Total Quizzes */}
        <div className="card-hover">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{progress?.total_quizzes || 0}</p>
          <p className="text-sm text-gray-600 mt-1">Quizzes Generated</p>
        </div>

        {/* Quiz Attempts */}
        <div className="card-hover">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{progress?.total_attempts || 0}</p>
          <p className="text-sm text-gray-600 mt-1">Quiz Attempts</p>
        </div>

        {/* Average Score */}
        <div className="card-hover">
          <div className="flex items-center justify-between mb-2">
            <div className={`w-12 h-12 ${performance?.bgColor} rounded-lg flex items-center justify-center`}>
              <svg className={`w-6 h-6 ${performance?.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{progress?.average_score || 0}%</p>
          <p className="text-sm text-gray-600 mt-1">Average Score</p>
        </div>
      </div>

      {/* Performance Overview */}
      {progress && progress.total_attempts > 0 && (
        <div className="card mb-8 fade-in">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className={`px-4 py-2 rounded-full ${performance.bgColor}`}>
              <span className={`font-semibold ${performance.color}`}>{performance.level}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span>{progress.average_score}%</span>
              </div>
              <div className="progress-bar h-4">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    progress.average_score >= 80 ? 'bg-green-600' : 
                    progress.average_score >= 60 ? 'bg-blue-600' : 
                    progress.average_score >= 40 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${progress.average_score}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{progress.total_notes}</p>
                <p className="text-sm text-gray-600">Study Materials</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{progress.total_attempts}</p>
                <p className="text-sm text-gray-600">Practice Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{progress.total_quizzes}</p>
                <p className="text-sm text-gray-600">Quizzes Created</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* First Upload */}
          <div className={`p-4 rounded-lg border-2 ${
            progress?.total_notes > 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                progress?.total_notes > 0 ? 'bg-blue-200' : 'bg-gray-200'
              }`}>
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">First Steps</p>
                <p className="text-sm text-gray-600">Upload your first note</p>
              </div>
            </div>
          </div>

          {/* Quiz Master */}
          <div className={`p-4 rounded-lg border-2 ${
            progress?.total_attempts >= 5 ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                progress?.total_attempts >= 5 ? 'bg-green-200' : 'bg-gray-200'
              }`}>
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Quiz Master</p>
                <p className="text-sm text-gray-600">Complete 5 quizzes</p>
              </div>
            </div>
          </div>

          {/* High Achiever */}
          <div className={`p-4 rounded-lg border-2 ${
            progress?.average_score >= 80 ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                progress?.average_score >= 80 ? 'bg-yellow-200' : 'bg-gray-200'
              }`}>
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">High Achiever</p>
                <p className="text-sm text-gray-600">Score 80% average</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {progress && progress.total_notes === 0 && (
        <div className="card text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Progress Yet</h3>
          <p className="text-gray-600 mb-6">Start uploading notes and taking quizzes to see your progress!</p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Upload Your First Note
          </button>
        </div>
      )}

      {/* Last Activity */}
      {progress?.last_activity && (
        <div className="card">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-600">
              Last activity: {new Date(progress.last_activity).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex space-x-4">
        <button
          onClick={() => router.push('/')}
          className="btn-primary flex-1"
        >
          Upload New Notes
        </button>
        <button
          onClick={fetchProgress}
          className="btn-secondary"
        >
          Refresh Progress
        </button>
      </div>
    </div>
  );
}