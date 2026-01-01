'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Send, Paperclip, X, Sparkles, Zap, Brain, TrendingUp, Shield, Target, Download, Trash2, RotateCw, MessageCircle } from 'lucide-react';

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
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Siap, Bro! 🚀 **MPT Warrior AI** aktif. Gue ready untuk:\n\n✅ **Analisa Chart** - Struktur, key level, entry points\n✅ **Hitung Risk** - Lot size dengan manajemen risk\n✅ **Reset Mental** - Mindset, affirmation, motivasi\n✅ **Strategy Review** - Evaluasi strategi trading Anda\n\nKirim chart atau tanya strategi. Mari kita menang! 💪' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [conversationMode, setConversationMode] = useState<'analysis' | 'strategy' | 'mindset' | 'general'>('general');
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ id: string; title: string; messages: typeof messages; date: string }>>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
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
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setSelectedImage((reader.result as string).split(',')[1]); 
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | null, overrideInput?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideInput || input;
    if ((!textToSend.trim() && !selectedImage) || isLoading) return;

    const userMessageContent = selectedImage ? `[IMAGE]\n${textToSend}` : textToSend;
    const userMessage = { role: 'user', content: userMessageContent };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const currentImage = selectedImage;
    setInput(''); 
    setSelectedImage(null); 
    setImagePreview(null); 
    setIsLoading(true);

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
          image: currentImage 
        }),
      });
      const data = await response.json();
      const aiMessage = data.choices[0].message;
      
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
    } catch {
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: '⚠️ Gagal koneksi ke AI. Cek API Key atau koneksi internet.' 
      }]);
    } finally {
      setIsLoading(false);
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
    setMessages([{ role: 'assistant', content: 'Siap, Bro! 🚀 **MPT Warrior AI** aktif. Apa yang ingin kita diskusikan hari ini?' }]);
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
    <div className="flex flex-col h-screen bg-slate-950 pb-safe">
      {/* Header with Mode Selector & Controls */}
      <header className="px-3 py-4 md:p-6 border-b border-slate-800 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-950 to-slate-900">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <div className="p-1.5 md:p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
            <Bot className="text-purple-500 w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-base md:text-xl text-yellow-500 truncate">AI Mentor</h1>
            <p className="text-xs text-slate-400 hidden sm:block">Trading Guidance System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <button
            onClick={exportChat}
            className="p-2 md:p-2.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white active:bg-slate-700"
            title="Export"
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 md:p-2.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white active:bg-slate-700 md:hidden"
            title="History"
          >
            <MessageCircle size={18} />
          </button>
          <button
            onClick={startNewChat}
            className="p-2 md:p-2.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white active:bg-slate-700"
            title="New Chat"
          >
            <RotateCw size={18} />
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
          {/* Conversation Mode Selector */}
          <div className="bg-slate-900 border-b border-slate-800 p-2 md:p-3 flex gap-1 md:gap-2 overflow-x-auto">
            {(['general', 'analysis', 'strategy', 'mindset'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setConversationMode(mode)}
                className={`px-3 md:px-4 py-2 rounded-lg font-semibold text-xs md:text-sm whitespace-nowrap transition-all active:scale-95 ${
                  conversationMode === mode
                    ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/50'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {mode === 'general' && '💬 General'}
                {mode === 'analysis' && '📊 Analysis'}
                {mode === 'strategy' && '📈 Strategy'}
                {mode === 'mindset' && '🧠 Mind'}
              </button>
            ))}
            {/* History Button Desktop */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="hidden md:flex ml-auto px-3 py-2 rounded-lg font-semibold text-sm whitespace-nowrap bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all items-center gap-2"
            >
              <MessageCircle size={16} />
              History
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 flex flex-col pb-24 md:pb-36 pb-safe">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[90%] md:max-w-[85%] ${
                  m.role === 'user' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-slate-900 border border-slate-800'
                } p-3 md:p-4 rounded-xl md:rounded-2xl`}>
                {/* Cek apakah ada risk calculation */}
                  {m.role === 'assistant' && m.content.includes('LOT SIZE') && m.content.includes('Balance') ? (
                    <>
                      <RiskCalculatorTable data={m.content} />
                      <ReactMarkdown 
                        components={{ 
                          strong: ({...props}) => <span className="font-bold text-yellow-400" {...props} />,
                          code: ({...props}) => <code className="bg-slate-800 px-2 py-1 rounded text-xs" {...props} />,
                          table: ({...props}) => <div className="hidden" {...props} />,
                          thead: ({...props}) => <div className="hidden" {...props} />,
                          tbody: ({...props}) => <div className="hidden" {...props} />,
                        }}
                      >
                        {m.content.split('Balance')[0] + m.content.split('LOT SIZE')[1]?.split('\n').slice(1).join('\n')}
                      </ReactMarkdown>
                    </>
                  ) : (
                    <ReactMarkdown 
                      components={{ 
                        strong: ({...props}) => <span className="font-bold text-yellow-400" {...props} />,
                        code: ({...props}) => <code className="bg-slate-800 px-2 py-1 rounded text-xs md:text-sm break-words" {...props} />,
                        p: ({...props}) => <p className="text-sm md:text-base leading-relaxed" {...props} />,
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-slate-900 border border-slate-800 rounded-xl md:rounded-2xl p-3 md:p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="animate-spin">⚙️</div>
                    <span className="text-xs md:text-sm italic">Sedang analisa...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="sticky bottom-0 z-40 bg-slate-900 border-t border-slate-800 flex flex-col flex-shrink-0">
            {/* Quick Actions - horizontally scrollable on mobile */}
            <div className="p-3 md:p-4 border-b border-slate-800 max-h-36 md:max-h-48">
              <p className="text-xs text-slate-400 mb-2 md:mb-3 font-semibold">⚡ QUICK ACTIONS</p>
              <div className="flex gap-2 overflow-x-auto md:grid md:grid-cols-3 md:gap-2 no-scrollbar">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubmit(null, action.prompt)}
                    className="flex flex-col items-start gap-1 p-2 md:p-3 bg-slate-800 border border-slate-700 rounded-lg hover:border-purple-500 hover:bg-slate-700 transition-all active:scale-95 group text-left min-w-[140px] md:min-w-0"
                  >
                    <span className="text-slate-400 group-hover:text-purple-400 transition-colors text-sm">{action.icon}</span>
                    <span className="text-slate-300 group-hover:text-white font-semibold text-xs line-clamp-2">{action.label}</span>
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

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3 p-3 md:p-4">
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
                className="p-2 md:p-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 rounded-lg md:rounded-xl transition-colors flex-shrink-0"
                title="Upload Chart"
              >
                <Paperclip size={18} className="text-slate-400" />
              </button>

              <input
                className="flex-1 min-w-0 p-2 md:p-3 bg-slate-950 border border-slate-700 rounded-lg md:rounded-xl text-white text-sm placeholder-slate-500 focus:border-yellow-500 focus:outline-none transition-colors"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya atau upload chart..."
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="p-2 md:p-3 bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-900 font-bold rounded-lg md:rounded-xl transition-colors flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </form>

            {/* Footer Info */}
            <p className="text-xs text-slate-500 px-3 md:px-4 py-2 md:py-3 text-center border-t border-slate-800">💡 Mode: <span className="font-bold text-yellow-400">{conversationMode.toUpperCase()}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}