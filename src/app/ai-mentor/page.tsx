'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Send, Paperclip, X } from 'lucide-react';

export default function AIMentor() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Siap, Bro. **MPT Warrior AI** aktif. Kirim chart atau tanya strategi trading.' }
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
        content: '⚠️ Gagal koneksi ke AI. Cek API Key atau koneksi internet.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: "🛡️ Cek Risk 1%", prompt: "Hitung lot size. Balance $1000, Risk 1%, SL 30 Pips." },
    { label: "🧘 Reset Mental", prompt: "Gue lagi FOMO/Emosi. Reset mindset gue sekarang." },
    { label: "🦅 Analisa Chart", prompt: "Lihat chart ini. Tentukan Structure & Key Level." },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-950">
      {/* Header */}
      <header className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Bot className="text-purple-500" size={24} />
        </div>
        <div>
          <h1 className="font-bold text-xl text-yellow-500">AI Mentor</h1>
          <p className="text-xs text-slate-400">Chart Analysis & Trading Guidance</p>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              m.role === 'user' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-slate-900 border border-slate-800'
            }`}>
              <ReactMarkdown 
                components={{ 
                  strong: ({node, ...props}) => <span className="font-bold text-yellow-400" {...props} /> 
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <div className="animate-spin">⚙️</div>
                <span className="text-sm italic">Analyzing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-900 p-6 border-t border-slate-800">
        {/* Quick Actions */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => setInput(action.prompt)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-xs text-yellow-500 whitespace-nowrap hover:bg-slate-700 transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-3 relative w-fit">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="h-20 rounded-lg border-2 border-yellow-500"
            />
            <button
              onClick={() => {
                setImagePreview(null);
                setSelectedImage(null);
              }}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Input Form */}
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
            className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
            title="Upload Chart"
          >
            <Paperclip size={20} className="text-slate-400" />
          </button>

          <input
            className="flex-1 p-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-yellow-500 focus:outline-none transition-colors"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything or upload chart..."
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="p-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-900 font-bold rounded-xl transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}