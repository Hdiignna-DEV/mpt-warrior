'use client';

import { useTranslation } from 'react-i18next';
import '@/utils/i18n';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Send, Paperclip, X, Sparkles, Zap, Brain, TrendingUp, Shield, Target, Download, Trash2, RotateCw, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Risk Calculator Table Component
function RiskCalculatorTable({ data }: { data: string }) {
  // Try to parse structured data from AI response
  const parseRiskData = (text: string) => {
    const balanceMatch = text.match(/Balance[:\s]+\$?([\d,]+)/i);
    const riskMatch = text.match(/Risk[:\s]+(\d+(?:\.\d+)?)\s*%/i);
    const slMatch = text.match(/SL[:\s]+(\d+)\s*Pips/i);
    const lotMatch = text.match(/LOT SIZE[:\s]+(\d+\.?\d*)\s*(?:lot)?/i);
    const maxRiskMatch = text.match(/Maksimal Kerugian[:\s]+\$?([\d,]+)/i);
    const pipValueMatch = text.match(/Nilai Per Pip[:\s]+\$?([\d.]+)/i);

    return {
      balance: balanceMatch ? balanceMatch[1] : '$1000',
      risk: riskMatch ? riskMatch[1] : '1%',
      sl: slMatch ? slMatch[1] : '30',
      lotSize: lotMatch ? lotMatch[1] : '0.03',
      maxRisk: maxRiskMatch ? maxRiskMatch[1] : '$10',
      pipValue: pipValueMatch ? pipValueMatch[1] : '$0.33'
    };
  };

  const riskData = parseRiskData(data);

  return (
    <div className="bg-slate-800/50 border border-yellow-500/30 rounded-xl p-4 my-3 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-yellow-500/50">
            <th className="text-left py-2 px-3 text-yellow-400 font-bold">Parameter</th>
            <th className="text-left py-2 px-3 text-yellow-400 font-bold">Nilai</th>
            <th className="text-left py-2 px-3 text-yellow-400 font-bold">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
            <td className="py-2 px-3 text-slate-300 font-semibold">💰 Balance Akun</td>
            <td className="py-2 px-3 text-yellow-300 font-bold">{riskData.balance}</td>
            <td className="py-2 px-3 text-slate-400 text-xs">Modal trading Anda</td>
          </tr>
          <tr className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
            <td className="py-2 px-3 text-slate-300 font-semibold">⚡ Risk Per Trade</td>
            <td className="py-2 px-3 text-yellow-300 font-bold">{riskData.risk}</td>
            <td className="py-2 px-3 text-slate-400 text-xs">% maksimal dari balance</td>
          </tr>
          <tr className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
            <td className="py-2 px-3 text-slate-300 font-semibold">🎯 Stop Loss (SL)</td>
            <td className="py-2 px-3 text-yellow-300 font-bold">{riskData.sl} Pips</td>
            <td className="py-2 px-3 text-slate-400 text-xs">Distance dari entry</td>
          </tr>
          <tr className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors bg-red-500/10">
            <td className="py-2 px-3 text-slate-300 font-semibold">💸 Maksimal Kerugian</td>
            <td className="py-2 px-3 text-red-400 font-bold">{riskData.maxRisk}</td>
            <td className="py-2 px-3 text-slate-400 text-xs">Uang maksimal yang bisa hilang</td>
          </tr>
          <tr className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
            <td className="py-2 px-3 text-slate-300 font-semibold">💵 Nilai Per Pip</td>
            <td className="py-2 px-3 text-yellow-300 font-bold">{riskData.pipValue}</td>
            <td className="py-2 px-3 text-slate-400 text-xs">Value setiap pips SL</td>
          </tr>
          <tr className="bg-green-500/10 border-t-2 border-green-500/50">
            <td className="py-2 px-3 text-slate-300 font-semibold">✅ LOT SIZE MAKSIMAL</td>
            <td className="py-2 px-3 text-green-400 font-black text-lg">{riskData.lotSize} Lot</td>
            <td className="py-2 px-3 text-slate-400 text-xs">Gunakan maksimal ini!</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function AIMentor() {
  const { t, i18n } = useTranslation();
  const { loading: authLoading } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '🎯 **Warrior Buddy** siap mendampingi, Bro!\n\n**HYBRID AI SYSTEM ACTIVE:**\n📸 **Warrior Vision** (Gemini) - Upload chart untuk analisa visual\n⚡ **Warrior Buddy** (Groq) - Chat cepat untuk konsultasi\n\n**Fitur:**\n✅ Analisa Chart Visual (SNR, Trendline, Setup)\n✅ Hitung Risk & Lot Size\n✅ Double-Check Discipline (cross-validate jurnal vs chart)\n✅ Reset Mental & Motivasi\n\nUpload chart atau tanya apa aja. Mari menang bersama! 💪', model: '⚡ Warrior Buddy' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiProcessing, setAiProcessing] = useState<'vision' | 'buddy' | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [conversationMode, setConversationMode] = useState<'analysis' | 'strategy' | 'mindset' | 'general'>('general');
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ id: string; title: string; messages: typeof messages; date: string }>>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [threadId] = useState(() => `thread_${Date.now()}`);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mpt_ai_chat_history');
    if (saved) {
      setChatHistory(JSON.parse(saved));
    }
  }, []);

  // Save chat history
  const saveChatHistory = (newHistory: typeof chatHistory) => {
    setChatHistory(newHistory);
    localStorage.setItem('mpt_ai_chat_history', JSON.stringify(newHistory));
  };

  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('❌ Format file tidak didukung!\n\nGunakan: JPG, PNG, atau WEBP');
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('❌ File terlalu besar!\n\nMaksimal: 5MB\nUkuran file Anda: ' + (file.size / 1024 / 1024).toFixed(2) + 'MB\n\n💡 Compress dulu gambarnya.');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setSelectedImage((reader.result as string).split(',')[1]); 
    };
    reader.onerror = () => {
      alert('❌ Gagal membaca file!\n\nCoba lagi atau gunakan gambar lain.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | null, overrideInput?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideInput || input;
    if ((!textToSend.trim() && !selectedImage) || isLoading) return;

    const userMessageContent = selectedImage ? `[IMAGE]\n${textToSend}` : textToSend;
    const userMessage = { role: 'user', content: userMessageContent, model: '' };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const currentImage = selectedImage;
    setInput(''); 
    setSelectedImage(null); 
    setImagePreview(null); 
    setIsLoading(true);
    
    // Set AI processing indicator
    setAiProcessing(currentImage ? 'vision' : 'buddy');

    // Add system context based on mode
    const systemContext = getSystemContext();
    const contextualMessages = [
      { role: 'system', content: systemContext },
      ...updatedMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
    ];

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: contextualMessages, 
          image: currentImage,
          language: i18n.language,
          threadId: threadId // Send thread ID for context sharing
        }),
      });
      
      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json();
        
        // Display server error message to user
        setMessages((prev) => [...prev, { 
          role: 'assistant', 
          content: errorData.error || `⚠️ Error ${response.status}: Gagal memproses permintaan.`,
          model: '❌ Error'
        }]);
        return;
      }
      
      const data = await response.json();
      const aiMessage = {
        ...data.choices[0].message,
        model: data.model // Include which AI responded
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      // Auto-save if this is a new conversation
      if (!currentChatId && updatedMessages.length === 1) {
        const newChatId = Date.now().toString();
        const newChat = {
          id: newChatId,
          title: textToSend.substring(0, 50) + (textToSend.length > 50 ? '...' : ''),
          messages: finalMessages,
          date: new Date().toLocaleString('id-ID')
        };
        const newHistory = [newChat, ...chatHistory];
        saveChatHistory(newHistory);
        setCurrentChatId(newChatId);
      }
    } catch (error) {
      console.error('AI Mentor error:', error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: '❌ Gagal koneksi ke AI Mentor.\n\n**Kemungkinan penyebab:**\n- Koneksi internet bermasalah\n- Server sedang maintenance\n- Quota API habis\n\nSilakan coba lagi dalam beberapa menit.',
        model: '❌ Error'
      }]);
    } finally {
      setIsLoading(false);
      setAiProcessing(null);
    }
  };

  const getSystemContext = () => {
    const baseContext = 'You are MPT Warrior AI Mentor - a professional trading mentor focused on Mindset, Plan, and Risk management (1% per trade max). Respond in Indonesian, professional yet friendly (Bro-to-Bro).';
    
    switch(conversationMode) {
      case 'analysis':
        return baseContext + ' Focus on technical analysis: chart patterns, support/resistance, entry points, and confirmation signals.';
      case 'strategy':
        return baseContext + ' Focus on strategy review: profitability, consistency, risk/reward ratio, and improvement areas.';
      case 'mindset':
        return baseContext + ' Focus on psychological aspects: discipline, emotion control, confidence, and trading psychology.';
      default:
        return baseContext;
    }
  };

  const exportChat = () => {
    const chatText = messages
      .map(m => `${m.role === 'user' ? 'You' : 'AI Mentor'}: ${m.content}`)
      .join('\n\n---\n\n');
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(chatText));
    element.setAttribute('download', `mpt-chat-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const startNewChat = () => {
    setMessages([{ role: 'assistant', content: 'Siap, Bro! 🚀 **MPT Warrior AI** aktif. Apa yang ingin kita diskusikan hari ini?', model: '⚡ Warrior Buddy' }]);
    setInput('');
    setSelectedImage(null);
    setImagePreview(null);
    setCurrentChatId(null);
    setConversationMode('general');
  };

  const loadChat = (chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      setShowHistory(false);
    }
  };

  const deleteChat = (chatId: string) => {
    const newHistory = chatHistory.filter(c => c.id !== chatId);
    saveChatHistory(newHistory);
    if (currentChatId === chatId) {
      startNewChat();
    }
  };

  const quickActions = [
    { label: "⚡ Hitung Risk 1%", prompt: "Balance $1000, Risk 1%, SL 30 Pips. Hitung lot size dan buat tabel dengan format:\nBalance | Risk | SL | Maksimal Kerugian | Nilai Per Pip | LOT SIZE MAKSIMAL", icon: <Zap size={16} /> },
    { label: "🧠 Reset Mental", prompt: "Gue lagi FOMO/Emosi. Berikan 3 affirmation trader dan reset mindset gue untuk trading lebih disiplin.", icon: <Brain size={16} /> },
    { label: "📊 Analisa Chart", prompt: "Lihat chart ini. Tentukan Structure, Support/Resistance, Key Level, dan potential entry points.", icon: <Sparkles size={16} /> },
    { label: "📈 Review Strategi", prompt: "Review strategi trading gue. Apa kelebihan dan kekurangan? Bagaimana improve konsistensi?", icon: <TrendingUp size={16} /> },
    { label: "🛡️ Money Management", prompt: "Jelasin best practice money management untuk trader. Berapa % per trade yang aman?", icon: <Shield size={16} /> },
    { label: "🎯 Entry Points", prompt: "Berikan 3 setup entry points yang paling profitable untuk pair ini. Jelaskan confirmation signals.", icon: <Target size={16} /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 pb-safe">
      {/* WAR ROOM HUD HEADER */}
      <header className="px-3 py-4 md:p-6 border-b border-amber-500/20 flex items-center justify-between gap-3 bg-slate-900/40 backdrop-blur-md relative overflow-hidden">
        {/* Scan line animation background */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-20 animate-pulse" />
        
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1 relative z-10">
          {/* Pulsing Radar Avatar */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-full flex items-center justify-center border-2 border-green-500/50">
              <Bot className="text-green-400 w-5 h-5 md:w-6 md:h-6" />
              {/* Radar sweep animation */}
              <div className="absolute inset-0 rounded-full border-2 border-green-500/30 animate-spin" style={{clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%)'}} />
            </div>
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-mono font-black text-sm md:text-lg text-amber-400 tracking-wider uppercase">HYBRID AI MENTOR</h1>
              {/* Dual System Status LED */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded text-[10px] font-mono uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400">DUAL-AI: {aiProcessing === 'vision' ? '📸 VISION' : aiProcessing === 'buddy' ? '⚡ BUDDY' : 'STANDBY'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded text-blue-400">📸 Gemini Vision</span>
              <span className="text-slate-600">+</span>
              <span className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded text-purple-400">⚡ Groq Brain</span>
            </div>
            <p className="text-[10px] md:text-xs text-slate-500 font-mono uppercase tracking-widest hidden sm:block mt-1">MPT WARRIOR INTELLIGENCE DIVISION</p>
          </div>
        </div>
        
        {/* Encryption Badge */}
        <div className="absolute top-2 right-3 md:top-4 md:right-6 text-[9px] font-mono text-amber-500/40 uppercase tracking-widest">
          ENCRYPTION: AES-256_SECURE
        </div>
        
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 relative z-10">
          <button
            onClick={exportChat}
            className="p-2 md:p-2.5 hover:bg-amber-500/10 rounded border border-amber-500/20 hover:border-amber-500/40 transition-all text-amber-400/60 hover:text-amber-400"
            title="Export Data"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 md:p-2.5 hover:bg-amber-500/10 rounded border border-amber-500/20 hover:border-amber-500/40 transition-all text-amber-400/60 hover:text-amber-400 md:hidden"
            title="Archive"
          >
            <MessageCircle size={16} />
          </button>
          <button
            onClick={startNewChat}
            className="p-2 md:p-2.5 bg-green-500/10 hover:bg-green-500/20 rounded border border-green-500/30 hover:border-green-500/50 transition-all text-green-400"
            title="New Operation"
          >
            <RotateCw size={16} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat History Sidebar - Mobile Modal & Desktop Sidebar */}
        {showHistory && (
          <>
            {/* Mobile Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 md:hidden z-40"
              onClick={() => setShowHistory(false)}
            />
            {/* Sidebar */}
            <div className="fixed left-0 top-16 bottom-0 w-72 md:static md:w-80 bg-slate-900 border-r border-slate-800 overflow-y-auto flex flex-col z-50">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-yellow-500 text-sm">Chat History</h3>
                  <p className="text-xs text-slate-400">Total: {chatHistory.length}</p>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="md:hidden p-1 hover:bg-slate-800 rounded"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {chatHistory.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500 text-center">No chat history yet</p>
                ) : (
                  chatHistory.map(chat => (
                    <div key={chat.id} className="p-3 border-b border-slate-800 hover:bg-slate-800 cursor-pointer transition-colors group">
                      <button
                        onClick={() => loadChat(chat.id)}
                        className="w-full text-left"
                      >
                        <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-yellow-400">{chat.title}</p>
                        <p className="text-xs text-slate-500">{chat.date}</p>
                      </button>
                      <button
                        onClick={() => deleteChat(chat.id)}
                        className="mt-2 w-full flex items-center gap-2 px-2 py-1.5 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 transition-colors active:bg-red-500/60"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* TACTICAL MODE SELECTOR */}
          <div className="bg-slate-900/60 border-b border-amber-500/20 p-2 md:p-3 flex gap-1 md:gap-2 overflow-x-auto backdrop-blur-sm">
            {(['general', 'analysis', 'strategy', 'mindset'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setConversationMode(mode)}
                className={`px-3 md:px-4 py-2 rounded-sm font-mono font-bold text-[10px] md:text-xs uppercase tracking-wider whitespace-nowrap transition-all border ${
                  conversationMode === mode
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800/50 text-slate-500 hover:text-amber-400 border-slate-700/50 hover:border-amber-500/30'
                }`}
              >
                {mode === 'general' && '[ GENERAL_MODE ]'}
                {mode === 'analysis' && '[ SCAN_STRUCTURE ]'}
                {mode === 'strategy' && '[ STRATEGIC_REVIEW ]'}
                {mode === 'mindset' && '[ MENTAL_RESET ]'}
              </button>
            ))}
            {/* History Button Desktop */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="hidden md:flex ml-auto px-3 py-2 rounded-sm font-mono font-bold text-xs uppercase tracking-wider whitespace-nowrap bg-slate-800/50 text-slate-500 hover:text-amber-400 border border-slate-700/50 hover:border-amber-500/30 transition-all items-center gap-2"
            >
              <MessageCircle size={14} />
              ARCHIVE
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-2 py-3 md:p-6 space-y-3 md:space-y-4 flex flex-col pb-32 md:pb-40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                {m.role === 'assistant' && (
                  <div className="flex gap-1.5 md:gap-3 max-w-[95%] md:max-w-[85%]">
                    {/* AI Avatar - Dynamic based on model */}
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="relative w-6 h-6 md:w-8 md:h-8">
                        {/* Different colors for different AI models */}
                        <div className={`absolute inset-0 ${(m as any).model?.includes('Vision') ? 'bg-blue-500/20' : 'bg-purple-500/20'} rounded-full animate-ping`} />
                        <div className={`relative w-full h-full ${(m as any).model?.includes('Vision') ? 'bg-gradient-to-br from-blue-500/40 to-blue-600/40 border-blue-500/50' : 'bg-gradient-to-br from-purple-500/40 to-purple-600/40 border-purple-500/50'} rounded-full flex items-center justify-center border`}>
                          <Bot className={`${(m as any).model?.includes('Vision') ? 'text-blue-300' : 'text-purple-300'} w-4 h-4 md:w-5 md:h-5`} />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 relative">
                      {/* AI Model Badge */}
                      {(m as any).model && (
                        <div className="mb-1 text-[9px] font-mono text-slate-500 flex items-center gap-1">
                          <span>{(m as any).model}</span>
                        </div>
                      )}
                      {/* Cek apakah ada risk calculation */}
                      {m.content.includes('LOT SIZE') && m.content.includes('Balance') ? (
                        <>
                          <RiskCalculatorTable data={m.content} />
                          <div className="bg-slate-800/40 border border-slate-700/50 p-3 md:p-4 rounded-lg md:rounded-xl text-slate-100">
                            <ReactMarkdown 
                              components={{ 
                                strong: ({...props}) => <span className="font-bold text-yellow-400" {...props} />,
                                em: ({...props}) => <em className="text-slate-300 italic" {...props} />,
                                code: ({...props}) => <code className="bg-slate-700/50 px-1.5 py-0.5 rounded text-xs font-mono text-yellow-300" {...props} />,
                                p: ({...props}) => <p className="text-sm md:text-base leading-relaxed mb-2 last:mb-0" {...props} />,
                                ul: ({...props}) => <ul className="list-disc list-inside text-sm md:text-base space-y-1 mb-2" {...props} />,
                                li: ({...props}) => <li className="text-sm md:text-base" {...props} />,
                                h3: ({...props}) => <h3 className="font-bold text-yellow-400 text-base mt-2 mb-1" {...props} />,
                                blockquote: ({...props}) => <blockquote className="border-l-4 border-yellow-500 pl-3 italic text-slate-300" {...props} />,
                                table: ({...props}) => <div className="hidden" {...props} />,
                                thead: ({...props}) => <div className="hidden" {...props} />,
                                tbody: ({...props}) => <div className="hidden" {...props} />,
                              }}
                            >
                              {m.content.split('Balance')[0] + m.content.split('LOT SIZE')[1]?.split('\n').slice(1).join('\n')}
                            </ReactMarkdown>
                          </div>
                        </>
                      ) : (
                        <div className="relative bg-slate-900/40 backdrop-blur-sm border-l-2 md:border-l-4 border-amber-500 p-2.5 md:p-5 rounded-sm shadow-lg shadow-amber-500/10">
                          {/* Intel Report Badge */}
                          <div className="hidden md:block absolute top-2 right-2 text-[9px] font-mono text-amber-500/50 uppercase tracking-widest">
                            INTEL-REPORT // SEC-ALPHA
                          </div>
                          <ReactMarkdown 
                            components={{ 
                              strong: ({...props}) => <span className="font-bold text-amber-400" {...props} />,
                              em: ({...props}) => <em className="text-slate-300 italic font-mono" {...props} />,
                              code: ({...props}) => <code className="bg-slate-800/60 px-1.5 py-0.5 rounded-sm text-[11px] md:text-xs font-mono text-green-400 border border-green-500/20" {...props} />,
                              p: ({...props}) => <p className="text-[13px] leading-relaxed md:text-base font-mono mb-2 md:mb-3 last:mb-0 text-slate-100" {...props} />,
                              ul: ({...props}) => <ul className="list-none text-[13px] md:text-base space-y-1.5 md:space-y-2 mb-2 md:mb-3 font-mono" {...props} />,
                              li: ({...props}) => <li className="text-[13px] md:text-base before:content-['▸_'] before:text-amber-500 before:font-bold" {...props} />,
                              h3: ({...props}) => <h3 className="font-mono font-bold text-amber-400 text-xs md:text-sm uppercase tracking-wider mt-2 md:mt-3 mb-1.5 md:mb-2 border-b border-amber-500/30 pb-1" {...props} />,
                              blockquote: ({...props}) => <blockquote className="border-l-2 border-amber-500 pl-2 md:pl-4 italic text-slate-400 bg-amber-500/5 py-1.5 md:py-2 font-mono text-[13px] md:text-base" {...props} />,
                            }}
                          >
                            {m.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {m.role === 'user' && (
                  <div className="bg-transparent border-r-2 border-amber-500 text-slate-100 p-2.5 md:p-4 rounded-sm max-w-[95%] md:max-w-[85%] text-right">
                    <ReactMarkdown 
                      components={{ 
                        p: ({...props}) => <p className="text-[13px] leading-relaxed md:text-base font-mono" {...props} />,
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in gap-1.5 md:gap-2">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="relative w-6 h-6 md:w-8 md:h-8">
                    {/* Dynamic color based on processing mode */}
                    <div className={`absolute inset-0 ${aiProcessing === 'vision' ? 'bg-blue-500/20' : 'bg-purple-500/20'} rounded-full animate-ping`} />
                    <div className={`relative w-full h-full ${aiProcessing === 'vision' ? 'bg-gradient-to-br from-blue-500/40 to-blue-600/40 border-blue-500/50' : 'bg-gradient-to-br from-purple-500/40 to-purple-600/40 border-purple-500/50'} rounded-full flex items-center justify-center border animate-pulse`}>
                      <Bot className={`${aiProcessing === 'vision' ? 'text-blue-300' : 'text-purple-300'} w-4 h-4 md:w-5 md:h-5`} />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900/60 backdrop-blur-sm border-l-2 border-amber-500/50 p-2.5 md:p-4 rounded-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-amber-400 text-xs md:text-sm font-mono">
                    {aiProcessing === 'vision' ? '📸 Scanning Chart via Warrior Vision...' : '⚡ Warrior Buddy is typing fast...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="sticky bottom-0 z-40 bg-slate-900 border-t border-slate-800 flex flex-col flex-shrink-0">
            {/* TACTICAL COMMAND BAR */}
            <div className="p-3 md:p-4 border-b border-amber-500/20 max-h-36 md:max-h-48 bg-slate-900/60 backdrop-blur-sm">
              <p className="text-[10px] text-amber-500 mb-2 md:mb-3 font-mono uppercase tracking-widest font-bold">[ QUICK_COMMANDS ]</p>
              <div className="flex gap-2 overflow-x-auto md:grid md:grid-cols-3 md:gap-2 no-scrollbar">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubmit(null, action.prompt)}
                    className="px-3 py-2 bg-slate-800/50 border border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/10 rounded-sm transition-all text-left min-w-[140px] md:min-w-0 group"
                  >
                    <span className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-amber-500 group-hover:text-amber-400 font-bold">
                      {action.label.replace('⚡ ', '[ ⚡ ').replace('🧠 ', '[ 🧠 ').replace('📊 ', '[ 📊 ').replace('📈 ', '[ 📈 ').replace('🛡️ ', '[ 🛡️ ').replace('🎯 ', '[ 🎯 ')} ]
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="px-3 md:px-4 pt-3 pb-2 md:py-3 border-b border-slate-800 relative w-fit">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imagePreview} 
                  alt="Chat image preview" 
                  className="h-16 md:h-20 rounded-lg border-2 border-yellow-500"
                  width={80}
                  height={80}
                />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setSelectedImage(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center transition-colors active:scale-90"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* COMMAND INPUT BAR */}
            <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3 p-2.5 md:p-4 bg-slate-950 border-t border-amber-500/20 safe-area-bottom">
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
                className="p-2 md:p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-amber-500/20 hover:border-amber-500/40 rounded-sm transition-all flex-shrink-0"
                title="Upload Chart"
              >
                <Paperclip size={16} className="text-amber-500/60 hover:text-amber-400" />
              </button>

              <input
                className="flex-1 min-w-0 px-2.5 py-2 md:px-4 md:py-3 bg-transparent border-b-2 border-amber-500/30 text-white text-[13px] md:text-sm font-mono placeholder-slate-600 focus:border-amber-500 focus:outline-none transition-all uppercase tracking-wider"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="> COMMAND..."
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-3 md:px-5 py-2 md:py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 hover:border-amber-500 disabled:bg-slate-800/50 disabled:border-slate-700/50 disabled:cursor-not-allowed text-amber-400 disabled:text-slate-600 font-mono font-bold text-[10px] md:text-xs uppercase tracking-wider rounded-sm transition-all flex-shrink-0 flex items-center justify-center gap-1.5"
              >
                <Send size={14} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">TRANSMIT</span>
              </button>
            </form>

            {/* SYSTEM STATUS */}
            <div className="text-[9px] md:text-[10px] text-slate-600 px-2 md:px-4 py-1.5 md:py-3 text-center border-t border-amber-500/10 font-mono uppercase tracking-widest bg-slate-950">
              <span className="text-amber-500/50">[ MODE:</span> <span className="font-bold text-amber-400">{conversationMode.toUpperCase()}</span> <span className="text-amber-500/50">] [ STATUS:</span> <span className="text-green-400">OPERATIONAL</span> <span className="text-amber-500/50">]</span>
              <div className="mt-1 flex items-center justify-center gap-2 text-[8px] md:text-[9px] flex-wrap">
                <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded">
                  <span className="text-slate-500">VISION:</span>
                  <span className="text-blue-400 font-bold">GEMINI 1.5</span>
                  <Sparkles size={8} className="text-blue-400" />
                </div>
                <span className="text-slate-600">+</span>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded">
                  <span className="text-slate-500">BRAIN:</span>
                  <span className="text-purple-400 font-bold">GROQ LLAMA 3.3</span>
                  <Zap size={8} className="text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}