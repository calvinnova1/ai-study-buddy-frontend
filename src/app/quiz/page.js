'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateQuiz } from '@/services/api';

export default function QuizPage() {
  const router = useRouter();
  const [uploadedText, setUploadedText] = useState('');
  const [fileName, setFileName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionType, setQuestionType] = useState('mixed');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

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

  // Generate quiz
  const handleGenerateQuiz = async () => {
    if (!uploadedText) {
      setError('No text available to generate quiz');
      return;
    }

    setIsGenerating(true);
    setError('');
    setQuestions([]);
    setUserAnswers({});
    setShowResults(false);

    const result = await generateQuiz(uploadedText, numQuestions, questionType);

    setIsGenerating(false);

    if (result.success) {
      setQuestions(result.data.questions);
      setCurrentQuestion(0);
    } else {
      setError(result.error);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion]: answer
    });
  };

  // Navigate questions
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Submit quiz and calculate score
  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correct_answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  // Reset quiz
  const handleReset = () => {
    setQuestions([]);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    setCurrentQuestion(0);
  };

  const currentQ = questions[currentQuestion];
  const answeredCount = Object.keys(userAnswers).length;
  const percentage = showResults ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Generator</h1>
        <p className="text-gray-600">Test your knowledge with AI-generated questions</p>
      </div>

      {/* File Info */}
      <div className="card mb-6">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <p className="font-medium text-gray-900">{fileName}</p>
            <p className="text-sm text-gray-600">{uploadedText.split(' ').length} words</p>
          </div>
        </div>
      </div>

      {/* Quiz Configuration */}
      {questions.length === 0 && !showResults && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Configure Quiz</h2>
          
          {/* Number of Questions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions: {numQuestions}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>3</span>
              <span>10</span>
            </div>
          </div>

          {/* Question Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setQuestionType('mcq')}
                className={`p-4 rounded-lg border-2 transition ${
                  questionType === 'mcq'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">Multiple Choice</h3>
                <p className="text-sm text-gray-600">A, B, C, D options</p>
              </button>

              <button
                onClick={() => setQuestionType('true_false')}
                className={`p-4 rounded-lg border-2 transition ${
                  questionType === 'true_false'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">True/False</h3>
                <p className="text-sm text-gray-600">Simple T/F questions</p>
              </button>

              <button
                onClick={() => setQuestionType('mixed')}
                className={`p-4 rounded-lg border-2 transition ${
                  questionType === 'mixed'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">Mixed</h3>
                <p className="text-sm text-gray-600">Combination of both</p>
              </button>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateQuiz}
            disabled={isGenerating}
            className="btn-success w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <div className="spinner mr-2" style={{ width: '20px', height: '20px' }}></div>
                Generating Quiz...
              </span>
            ) : (
              'Generate Quiz'
            )}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="card mb-6 bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Quiz Questions */}
      {questions.length > 0 && !showResults && (
        <div className="card fade-in">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>Answered: {answeredCount}/{questions.length}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <div className="flex items-start space-x-2 mb-4">
              <span className="badge badge-blue">Q{currentQuestion + 1}</span>
              <h3 className="text-lg font-medium text-gray-900 flex-1">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.type === 'mcq' ? (
                currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`quiz-option w-full text-left ${
                      userAnswers[currentQuestion] === option ? 'selected' : ''
                    }`}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))
              ) : (
                <>
                  <button
                    onClick={() => handleAnswerSelect('True')}
                    className={`quiz-option w-full text-left ${
                      userAnswers[currentQuestion] === 'True' ? 'selected' : ''
                    }`}
                  >
                    <span className="font-medium mr-2">✓</span> True
                  </button>
                  <button
                    onClick={() => handleAnswerSelect('False')}
                    className={`quiz-option w-full text-left ${
                      userAnswers[currentQuestion] === 'False' ? 'selected' : ''
                    }`}
                  >
                    <span className="font-medium mr-2">✗</span> False
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={answeredCount !== questions.length}
                className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn-primary"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className="card fade-in">
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl font-bold"
              style={{
                backgroundColor: percentage >= 70 ? '#dcfce7' : percentage >= 50 ? '#fef3c7' : '#fee2e2',
                color: percentage >= 70 ? '#166534' : percentage >= 50 ? '#92400e' : '#991b1b'
              }}
            >
              {percentage}%
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-gray-600">
              You scored {score} out of {questions.length}
            </p>
          </div>

          {/* Answer Review */}
          <div className="space-y-4 mb-6">
            {questions.map((q, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === q.correct_answer;
              
              return (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}>
                  <div className="flex items-start space-x-2 mb-2">
                    {isCorrect ? (
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">{q.question}</p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Your answer:</span> {userAnswer || 'Not answered'}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Correct answer:</span> {q.correct_answer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button onClick={handleReset} className="btn-primary flex-1">
              Generate New Quiz
            </button>
            <button onClick={() => router.push('/progress')} className="btn-secondary flex-1">
              View Progress
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