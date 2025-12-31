'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Send, Paperclip, X, Sparkles, Zap, Brain } from 'lucide-react';

export default function AIMentor() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '🚀 **MPT Warrior AI Mentor** activated. Ready to analyze charts, calculate risk, or reset your mindset. What\'s on your mind, Warrior?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setSelectedImage((reader.result as string).split(',')[1]); 
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: any, overrideInput?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideInput || input;
    if ((!textToSend.trim() && !selectedImage) || isLoading) return;

    const userMessageContent = selectedImage ? `[IMAGE]\n${textToSend}` : textToSend;
    const userMessage = { role: 'user', content: userMessageContent };
    
    setMessages((prev) => [...prev, userMessage]);
    const currentImage = selectedImage;
    setInput(''); 
    setSelectedImage(null); 
    setImagePreview(null); 
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', content: textToSend }], 
          image: currentImage 
        }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, data.choices[0].message]);
    } catch (error) {
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: '⚠️ Connection failed. Check API Key or internet connection.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: "⚡ Risk Calculator", prompt: "Hitung lot size. Balance $1000, Risk 1%, SL 30 Pips. Format hasil dengan table.", icon: <Zap size={16} /> },
    { label: "🧠 Mental Reset", prompt: "Gue lagi FOMO/Emosi. Reset mindset gue dengan 3 affirmation trader.", icon: <Brain size={16} /> },
    { label: "📊 Chart Analysis", prompt: "Analyze this chart. Identify structure, support/resistance, entry points.", icon: <Sparkles size={16} /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
      {/* Animated Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-purple-500/20 backdrop-blur-md bg-slate-950/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg shadow-purple-500/50">
            <Bot className="text-white" size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400">
                AI Mentor
              </h1>
              <span className="text-xs px-2 py-1 bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-500/50 rounded-full text-purple-300 font-semibold">
                BETA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Chart Analysis • Risk Management • Mental Training</p>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-300`}>
            <div className={`max-w-[85%] ${
              m.role === 'user' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-slate-900/80 border border-purple-500/30 text-slate-100 shadow-lg shadow-purple-500/10'
            } p-4 rounded-2xl backdrop-blur-sm`}>
              <ReactMarkdown 
                components={{ 
                  strong: ({node, ...props}) => <span className="font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent" {...props} />,
                  code: ({node, ...props}) => <code className="bg-slate-800/50 px-2 py-1 rounded text-xs font-mono text-blue-300" {...props} />,
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-in fade-in">
            <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-purple-300">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
                <span className="text-sm italic">Analyzing your request...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-6 border-t border-purple-500/20">
        {/* Quick Actions - Enhanced */}
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-2 font-semibold tracking-wider">QUICK ACTIONS</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleSubmit(null, action.prompt)}
                className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 border border-purple-500/30 hover:border-purple-500/60 rounded-lg text-xs text-slate-300 hover:text-purple-300 whitespace-nowrap transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <span className="group-hover:scale-110 transition-transform">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Image Preview - Enhanced */}
        {imagePreview && (
          <div className="mb-4 relative w-fit animate-in fade-in">
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-24 rounded-lg border-2 border-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/30"
              />
              <button
                onClick={() => {
                  setImagePreview(null);
                  setSelectedImage(null);
                }}
                className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full w-7 h-7 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Chart uploaded • Ready to analyze</p>
          </div>
        )}

        {/* Input Form - Enhanced */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-purple-900/50 hover:to-blue-900/50 border border-slate-700 hover:border-purple-500/50 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            title="Upload Chart"
          >
            <Paperclip size={20} className="text-slate-400 group-hover:text-purple-400" />
          </button>

          <input
            className="flex-1 p-3 bg-slate-900/50 border border-slate-700 hover:border-purple-500/50 focus:border-purple-500 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all duration-300 backdrop-blur-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything or upload chart..."
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 disabled:scale-100"
          >
            <Send size={20} />
          </button>
        </form>

        {/* Footer Hint */}
        <p className="text-xs text-slate-500 mt-3 text-center">💡 Upload charts or describe your trading situation for personalized guidance</p>
      </div>
    </div>
  );
}