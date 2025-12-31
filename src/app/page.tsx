'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Siap, Bro. **MPT Bot** di sini. Upload chart untuk analisa teknikal, atau pilih menu taktis di bawah.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setSelectedImage(base64String.split(',')[1]); 
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: any, overrideInput?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideInput || input;
    
    if ((!textToSend.trim() && !selectedImage) || isLoading) return;

    const userMessageContent = selectedImage 
      ? `[MENGIRIM GAMBAR CHART]\n\n${textToSend}` 
      : textToSend;
      
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

      if (!response.ok) throw new Error('Gagal koneksi');

      const data = await response.json();
      const botMessage = data.choices[0].message;
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'assistant', content: '⚠️ Koneksi terputus. Coba lagi.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // DAFTAR TOMBOL PINTAS (TACTICAL BUTTONS)
  const quickActions = [
    { label: "🛡️ Cek Risk 1%", prompt: "Hitung lot size. Balance saya $1000, Risk 1%, SL 30 Pips. Berapa lot?" },
    { label: "🧘 Reset Psikologi", prompt: "Bang, gue lagi FOMO pengen entry paksa. Tolong tampar gue pake mindset MPT." },
    { label: "🦅 Analisa Struktur", prompt: "Lihat gambar chart ini. Tentukan Structure (HH/HL), Trend, dan Key Level-nya. Jangan kasih sinyal, cuma analisa murni." },
    { label: "📋 Buat Trading Plan", prompt: "Buatkan checklist Trading Plan sederhana untuk sesi London hari ini." },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
      {/* HEADER */}
      <header className="p-4 bg-slate-800 border-b border-slate-700 flex items-center shadow-lg z-10 justify-between">
        <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-3 animate-pulse"></div>
            <h1 className="font-bold text-xl tracking-wide text-yellow-500">MPT WARRIOR HUB <span className="text-xs text-slate-400 font-normal ml-2">v4.0 (Tactical)</span></h1>
        </div>
      </header>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((m, index) => (
            <div key={index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl shadow-md ${
                m.role === 'user' ? 'bg-yellow-600 text-white rounded-tr-none' : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600'
            }`}>
                {m.role === 'assistant' ? (
                <ReactMarkdown
                    components={{
                    strong: ({node, ...props}) => <span className="font-bold text-yellow-400" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc ml-5 space-y-1 my-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal ml-5 space-y-1 my-2" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                    }}
                >
                    {m.content}
                </ReactMarkdown>
                ) : (
                <p className="whitespace-pre-wrap">{m.content}</p>
                )}
            </div>
            </div>
        ))}
        {isLoading && (
            <div className="flex justify-start animate-pulse">
            <div className="bg-slate-700 p-4 rounded-2xl rounded-tl-none text-sm text-slate-400 italic">
                🦅 MPT Bot sedang berpikir...
            </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA & QUICK ACTIONS */}
      <div className="bg-slate-800 border-t border-slate-700 p-4 pb-6">
        
        {/* QUICK ACTION BUTTONS */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
            {quickActions.map((action, idx) => (
                <button 
                    key={idx}
                    onClick={() => setInput(action.prompt)}
                    className="whitespace-nowrap px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-full text-xs font-medium text-yellow-500 transition-colors"
                >
                    {action.label}
                </button>
            ))}
        </div>

        {/* IMAGE PREVIEW */}
        {imagePreview && (
            <div className="mb-2 relative w-fit">
                <img src={imagePreview} alt="Preview" className="h-20 rounded-lg border border-yellow-500" />
                <button 
                    type="button"
                    onClick={() => { setImagePreview(null); setSelectedImage(null); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-sm hover:bg-red-600"
                >
                    X
                </button>
            </div>
        )}

        {/* INPUT FORM */}
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto items-end">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-all border border-slate-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
            </svg>
          </button>

          <input
            className="flex-1 p-3 bg-slate-900 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-slate-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pesan atau pilih tombol di atas..."
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="p-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}