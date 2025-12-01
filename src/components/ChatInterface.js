import { useState, useEffect } from 'react';

export default function ChatInterface({ documentText }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [isWaitingForName, setIsWaitingForName] = useState(true);

  // 1. On load: Check if we already know the user's name
  useEffect(() => {
    const savedName = localStorage.getItem('studyBuddyUserName');
    
    if (savedName) {
      setUserName(savedName);
      setIsWaitingForName(false);
      // If we know the name, immediately get recommendations
      getRecommendations(savedName);
    } else {
      // If we don't know the name, ask for it
      setMessages([
        { role: 'ai', content: "Hello! I'm your AI Study Buddy. Before we start, what should I call you?" }
      ]);
    }
  }, []); // Run only once when component mounts

  // 2. Function to get AI recommendations
  const getRecommendations = async (name) => {
    setLoading(true);
    try {
      // We send a specific prompt to the AI to act as a guide
      const systemPrompt = `
        The user's name is ${name}. 
        Analyze the provided document context.
        1. Greet the user by name warmly.
        2. Based ONLY on the document, list 3 key topics or interesting questions they might want to study.
        3. Ask them which one they would like to start with.
      `;

      const response = await fetch('https://ai-study-buddy-backend-dexp.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: systemPrompt, // This is our hidden instruction
          context: documentText
        })
      });

      const data = await response.json();
      
      // Add the recommendation to the chat
      setMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: `Welcome ${name}! I'm ready to help you study this document.` }]);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add User Message to UI
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // --- Scenario A: We are waiting for the name ---
    if (isWaitingForName) {
      const name = input.trim();
      setUserName(name);
      localStorage.setItem('studyBuddyUserName', name); // Save for future
      setIsWaitingForName(false);
      
      // Now that we have the name, ask AI for recommendations
      await getRecommendations(name);
      return;
    }

    // --- Scenario B: Normal Chat ---
    setLoading(true);
    try {
      const response = await fetch('https://ai-study-buddy-backend-dexp.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          context: documentText
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I couldn't reach the server." }]);
    }
    setLoading(false);
  };

  return (
    <div className="mt-8 border rounded-lg p-4 bg-white shadow-sm max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          Chat with your Document
        </h3>
        {userName && <span className="text-sm text-gray-500">Studying as: {userName}</span>}
      </div>
      
      {/* Messages Area */}
      <div className="h-80 overflow-y-auto mb-4 bg-gray-50 p-4 rounded-lg space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-[85%] ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              {/* This enables basic formatting like new lines */}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none text-gray-500 text-sm animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isWaitingForName ? "Type your name..." : "Ask a question about your notes..."}
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}