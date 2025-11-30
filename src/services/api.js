import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-study-buddy-backend-dexp.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// File Upload API
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Upload failed',
    };
  }
};

// Summarize Text API
export const summarizeText = async (text, summaryType = 'concise') => {
  try {
    const response = await api.post('/api/summarize', {
      text: text,
      summary_type: summaryType,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Summarization failed',
    };
  }
};

// Generate Quiz API
export const generateQuiz = async (text, numQuestions = 5, questionType = 'mixed') => {
  try {
    const response = await api.post('/api/generate-quiz', {
      text: text,
      num_questions: numQuestions,
      question_type: questionType,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Quiz generation failed',
    };
  }
};

// Get User Progress API
export const getUserProgress = async (userId) => {
  try {
    const response = await api.get(`/api/progress/${userId}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'Failed to fetch progress',
    };
  }
};

// Health Check API
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Backend is not responding',
    };
  }
};

// Validate file before upload
export const validateFile = (file) => {
  const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) || 10485760; // 10MB
  const allowedTypes = ['.txt', '.pdf', '.docx'];
  
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
  
  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`,
    };
  }
  
  // Check file type
  if (!allowedTypes.includes(fileExtension)) {
    return {
      valid: false,
      error: `File type not supported. Allowed: ${allowedTypes.join(', ')}`,
    };
  }
  
  return {
    valid: true,
  };
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Generate unique user ID (simple implementation)
export const generateUserId = () => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create user ID from localStorage
export const getUserId = () => {
  if (typeof window === 'undefined') return null;
  
  let userId = localStorage.getItem('study_buddy_user_id');
  
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem('study_buddy_user_id', userId);
  }
  
  return userId;
};

export default api;