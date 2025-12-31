'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Send, Paperclip, X, Image as ImageIcon, Loader } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

export default function AIMentor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: 'Selamat datang di MPT AI Mentor! Saya siap membantu Anda dengan pertanyaan trading, analisis chart, dan mindset trading. Apa yang bisa saya bantu hari ini?',
    }]);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !image) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      image: image || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setImage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content:
              m.image && m.image.includes('base64')
                ? [
                    { type: 'text', text: m.content },
                    {
                      type: 'image',
                      source: { type: 'base64', media_type: 'image/jpeg', data: m.image.split(',')[1] },
                    },
                  ]
                : m.content,
          })),
          userMessage: {
            role: 'user',
            content:
              image && image.includes('base64')
                ? [
                    { type: 'text', text: input },
                    {
                      type: 'image',
                      source: { type: 'base64', media_type: 'image/jpeg', data: image.split(',')[1] },
                    },
                  ]
                : input,
          },
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Terjadi kesalahan. Silakan coba lagi.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-slate-950 rounded-none md:rounded-xl md:m-8 border-0 md:border md:border-slate-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center gap-3 rounded-t-none md:rounded-t-lg border-b border-slate-700">
        <Bot size={24} className="text-white" />
        <div>
          <h1 className="font-bold text-white text-lg">MPT AI Mentor</h1>
          <p className="text-blue-100 text-xs">Powered by Gemini AI</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Bot size={18} className="text-cyan-400" />
              </div>
            )}

            <div
              className={`max-w-xs md:max-w-2xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-black rounded-3xl rounded-tr-lg'
                  : 'bg-slate-800 text-slate-100 rounded-3xl rounded-tl-lg'
              } px-5 py-3 shadow-lg`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Chart"
                  className="max-w-full h-auto rounded-lg mb-2 border border-slate-600"
                />
              )}
              <div className="prose prose-invert max-w-none text-sm">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    code: ({ children }) => (
                      <code className={`${msg.role === 'user' ? 'bg-black/20' : 'bg-slate-900'} px-2 py-1 rounded text-xs`}>
                        {children}
                      </code>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <span className="text-black font-bold text-sm">You</span>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Bot size={18} className="text-cyan-400" />
            </div>
            <div className="bg-slate-800 rounded-3xl rounded-tl-lg px-5 py-4 flex gap-2">
              <Loader size={18} className="text-cyan-400 animate-spin" />
              <span className="text-slate-400 text-sm">MPT AI Mentor sedang berpikir...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {image && (
        <div className="px-6 py-3 border-t border-slate-700 bg-slate-900/50">
          <div className="relative inline-block">
            <img src={image} alt="Preview" className="max-h-24 rounded-lg border border-slate-600" />
            <button
              onClick={() => setImage(null)}
              className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 rounded-full transition-all"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-slate-700 p-4 md:p-6 bg-slate-900/50 rounded-b-none md:rounded-b-lg">
        <div className="flex gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 p-3 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-yellow-400"
          >
            <Paperclip size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Tanya tentang trading, analisis chart, atau mindset..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all placeholder-slate-500"
            disabled={loading}
          />

          <button
            onClick={sendMessage}
            disabled={loading || (!input.trim() && !image)}
            className="flex-shrink-0 p-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}