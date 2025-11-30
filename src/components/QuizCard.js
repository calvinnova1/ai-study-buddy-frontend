'use client';

import { useState } from 'react';

export default function QuizCard({ question, questionNumber, totalQuestions, onAnswerSelect, selectedAnswer, showAnswer = false }) {
  const [localAnswer, setLocalAnswer] = useState(selectedAnswer || null);

  const handleSelect = (answer) => {
    setLocalAnswer(answer);
    if (onAnswerSelect) {
      onAnswerSelect(answer);
    }
  };

  const isCorrect = showAnswer && localAnswer === question.correct_answer;
  const isIncorrect = showAnswer && localAnswer !== question.correct_answer && localAnswer !== null;

  return (
    <div className="card fade-in">
      {/* Question Header */}
      <div className="flex items-start space-x-3 mb-6">
        <span className="badge badge-blue flex-shrink-0">Q{questionNumber}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              question.type === 'mcq' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
            }`}>
              {question.type === 'mcq' ? 'Multiple Choice' : 'True/False'}
            </span>
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            {question.question}
          </h3>
        </div>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.type === 'mcq' ? (
          // Multiple Choice Options
          question.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            const isSelected = localAnswer === option;
            const isCorrectOption = showAnswer && option === question.correct_answer;
            const isWrongSelection = showAnswer && isSelected && !isCorrectOption;

            return (
              <button
                key={index}
                onClick={() => !showAnswer && handleSelect(option)}
                disabled={showAnswer}
                className={`quiz-option w-full text-left ${
                  isSelected && !showAnswer ? 'selected' : ''
                } ${
                  isCorrectOption ? 'correct' : ''
                } ${
                  isWrongSelection ? 'incorrect' : ''
                } ${
                  showAnswer ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    isCorrectOption ? 'bg-green-200 text-green-800' :
                    isWrongSelection ? 'bg-red-200 text-red-800' :
                    isSelected ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {letter}
                  </span>
                  <span className="flex-1 pt-1">{option}</span>
                  {showAnswer && isCorrectOption && (
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {showAnswer && isWrongSelection && (
                    <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })
        ) : (
          // True/False Options
          <>
            <button
              onClick={() => !showAnswer && handleSelect('True')}
              disabled={showAnswer}
              className={`quiz-option w-full text-left ${
                localAnswer === 'True' && !showAnswer ? 'selected' : ''
              } ${
                showAnswer && question.correct_answer === 'True' ? 'correct' : ''
              } ${
                showAnswer && localAnswer === 'True' && question.correct_answer !== 'True' ? 'incorrect' : ''
              } ${
                showAnswer ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    showAnswer && question.correct_answer === 'True' ? 'bg-green-200 text-green-800' :
                    showAnswer && localAnswer === 'True' && question.correct_answer !== 'True' ? 'bg-red-200 text-red-800' :
                    localAnswer === 'True' ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    ✓
                  </span>
                  <span className="font-medium">True</span>
                </div>
                {showAnswer && question.correct_answer === 'True' && (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {showAnswer && localAnswer === 'True' && question.correct_answer !== 'True' && (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </button>

            <button
              onClick={() => !showAnswer && handleSelect('False')}
              disabled={showAnswer}
              className={`quiz-option w-full text-left ${
                localAnswer === 'False' && !showAnswer ? 'selected' : ''
              } ${
                showAnswer && question.correct_answer === 'False' ? 'correct' : ''
              } ${
                showAnswer && localAnswer === 'False' && question.correct_answer !== 'False' ? 'incorrect' : ''
              } ${
                showAnswer ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    showAnswer && question.correct_answer === 'False' ? 'bg-green-200 text-green-800' :
                    showAnswer && localAnswer === 'False' && question.correct_answer !== 'False' ? 'bg-red-200 text-red-800' :
                    localAnswer === 'False' ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    ✗
                  </span>
                  <span className="font-medium">False</span>
                </div>
                {showAnswer && question.correct_answer === 'False' && (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {showAnswer && localAnswer === 'False' && question.correct_answer !== 'False' && (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </button>
          </>
        )}
      </div>

      {/* Answer Feedback (shown after submission) */}
      {showAnswer && (
        <div className={`mt-6 p-4 rounded-lg border-2 fade-in ${
          isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start space-x-2">
            {isCorrect ? (
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <div>
              <p className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              {!isCorrect && localAnswer && (
                <p className="text-sm text-gray-700 mt-1">
                  The correct answer is: <span className="font-medium">{question.correct_answer}</span>
                </p>
              )}
              {!localAnswer && (
                <p className="text-sm text-gray-700 mt-1">
                  You didn't answer this question. The correct answer is: <span className="font-medium">{question.correct_answer}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}