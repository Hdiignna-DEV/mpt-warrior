'use client';

import { useTranslation } from 'react-i18next';
import '@/utils/i18n';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Send, Paperclip, X, Sparkles, Zap, Brain, TrendingUp, Shield, Target, Download, Trash2, RotateCw, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { MessageBubble, CommanderArkaAvatar } from '@/components/ChatUIEnhancers';
import { FloatingAIMentorBubble } from '@/components/FloatingAIMentor';
import { getPoseFromConversation } from '@/lib/pose-detection';

// Risk Calculator Table Component (unchanged)
function RiskCalculatorTable({ data }: { data: string }) {
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
    <div className="bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-4 my-3 overflow-x-auto shadow-lg shadow-cyan-500/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-cyan-500/30">
            <th className="text-left py-2 px-3 text-cyan-400 font-bold">Parameter</th>
            <th className="text-left py-2 px-3 text-cyan-400 font-bold">Nilai</th>
            <th className="text-left py-2 px-3 text-cyan-400 font-bold">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-700/30 hover:bg-white/5 transition-colors">
            <td className="py-2 px-3 text-slate-300 font-semibold">💰 Balance Akun</td>
            <td className="py-2 px-3 text-cyan-300 font-bold">{riskData.balance}</td>
            <td className="py-2 px-3 text-slate-400 text-xs">Modal trading Anda</td>
          </tr>
          <tr className="border-b border-slate-700/30 hover:bg-white/5 transition-colors">
            <td className="py-2 px-3 text-slate-300 font-semibold">⚡ Risk Per Trade</td>
            <td className="py-2 px-3 text-cyan-300 font-bold">{riskData.risk}</td>
            <td className="py-2 px-3 text-slate-400 text-xs">% maksimal dari balance</td>
          </tr>
          <tr className="border-b border-slate-700/30 hover:bg-white/5 transition-colors">
            <td className="py-2 px-3 text-slate-300 font-semibold">🎯 Stop Loss (SL)</td>
            <td className="py-2 px-3 text-cyan-300 font-bold">{riskData.sl} Pips</td>
            <td className="py-2 px-3 text-slate-400 text-xs">Distance dari entry</td>
          </tr>
          <tr className="border-b border-slate-700/30 hover:bg-red-500/10 transition-colors bg-red-500/5">
            <td className="py-2 px-3 text-slate-300 font-semibold">💸 Maksimal Kerugian</td>
            <td className="py-2 px-3 text-red-400 font-bold">{riskData.maxRisk}</td>
            <td className="py-2 px-3 text-slate-400 text-xs">Uang maksimal yang bisa hilang</td>
          </tr>
          <tr className="border-b border-slate-700/30 hover:bg-white/5 transition-colors">
            <td className="py-2 px-3 text-slate-300 font-semibold">💵 Nilai Per Pip</td>
            <td className="py-2 px-3 text-cyan-300 font-bold">{riskData.pipValue}</td>
            <td className="py-2 px-3 text-slate-400 text-xs">Value setiap pips SL</td>
          </tr>
          <tr className="bg-green-500/10 border-t-2 border-green-500/30">
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
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [latestTrades, setLatestTrades] = useState<any[]>([]);
  const [userEmotionState, setUserEmotionState] = useState<'Tenang' | 'Takut' | 'Serakah' | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mascotOpacity, setMascotOpacity] = useState<'opacity-100' | 'opacity-30'>('opacity-100');
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile dragging state
  const [avatarPos, setAvatarPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Monitor scroll for opacity toggle
  useEffect(() => {
    const messagesContainer = document.querySelector('[data-messages-container]');
    if (!messagesContainer) return;

    const handleScroll = () => {
      setMascotOpacity('opacity-30');
      setIsScrolling(true);
      
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setMascotOpacity('opacity-100');
        setIsScrolling(false);
      }, 2000);
    };

    messagesContainer.addEventListener('scroll', handleScroll);
    return () => {
      messagesContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Load chat history from Cosmos DB and auto-load last chat
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const token = localStorage.getItem('mpt_token');
        const response = await fetch('/api/chat/history', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Load each thread with its messages
          const formattedHistory = await Promise.all(data.threads.map(async (thread: any) => {
            try {
              // Fetch messages for this thread
              const messagesResponse = await fetch(`/api/chat/thread/${thread.id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
              });
              
              let threadMessages = [];
              if (messagesResponse.ok) {
                const threadData = await messagesResponse.json();
                threadMessages = threadData.messages || [];
              }
              
              return {
                id: thread.id,
                title: thread.title,
                messages: threadMessages.map((msg: any) => ({
                  role: msg.role,
                  content: msg.content,
                  model: msg.model || '⚡ Warrior Buddy'
                })),
                date: new Date(thread.updatedAt).toLocaleString('id-ID'),
              };
            } catch (error) {
              console.error('Error loading messages for thread', thread.id, ':', error);
              return {
                id: thread.id,
                title: thread.title,
                messages: [],
                date: new Date(thread.updatedAt).toLocaleString('id-ID'),
              };
            }
          }));
          
          setChatHistory(formattedHistory);
          
          // Auto-load the most recent chat (first in the list)
          const savedLastThreadId = localStorage.getItem('mpt_last_thread_id');
          if (formattedHistory.length > 0) {
            const lastChat = formattedHistory[0];
            
            // If we have a saved thread ID, try to find and load it
            if (savedLastThreadId) {
              const targetChat = formattedHistory.find(c => c.id === savedLastThreadId);
              if (targetChat && targetChat.messages.length > 0) {
                setMessages(targetChat.messages);
                setCurrentChatId(targetChat.id);
                setThreadId(targetChat.id);
                return;
              }
            }
            
            // Otherwise, load the most recent chat
            if (lastChat.messages.length > 0) {
              setMessages(lastChat.messages);
              setCurrentChatId(lastChat.id);
              setThreadId(lastChat.id);
            }
          }
        } else {
          // If API fails, try localStorage
          const saved = localStorage.getItem('mpt_ai_chat_history');
          if (saved) {
            try {
              const history = JSON.parse(saved);
              setChatHistory(history);
              
              // Try to restore last chat from local history
              const savedLastThreadId = localStorage.getItem('mpt_last_thread_id');
              if (history.length > 0) {
                const targetChat = savedLastThreadId 
                  ? history.find((c: any) => c.id === savedLastThreadId) 
                  : history[0];
                
                if (targetChat && targetChat.messages.length > 0) {
                  setMessages(targetChat.messages);
                  setCurrentChatId(targetChat.id);
                  setThreadId(targetChat.id);
                }
              }
            } catch (e) {
              console.error('Failed to parse localStorage history:', e);
            }
          }
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem('mpt_ai_chat_history');
        if (saved) {
          try {
            const history = JSON.parse(saved);
            setChatHistory(history);
            
            // Try to restore last chat
            const savedLastThreadId = localStorage.getItem('mpt_last_thread_id');
            if (history.length > 0) {
              const targetChat = savedLastThreadId 
                ? history.find((c: any) => c.id === savedLastThreadId) 
                : history[0];
              
              if (targetChat && targetChat.messages.length > 0) {
                setMessages(targetChat.messages);
                setCurrentChatId(targetChat.id);
                setThreadId(targetChat.id);
              }
            }
          } catch (e) {
            console.error('Failed to parse localStorage history:', e);
          }
        }
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, []);
  
  useEffect(() => {
    const loadLatestTrades = async () => {
      try {
        const token = localStorage.getItem('mpt_token');
        const response = await fetch('/api/trades?limit=5', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          setLatestTrades(data.trades || []);
          
          if (data.trades && data.trades.length > 0) {
            setUserEmotionState(data.trades[0].emotion);
          }
        }
      } catch (error) {
        console.error('Error loading latest trades:', error);
      }
    };
    
    loadLatestTrades();
  }, []);

  // Restore thread ID from localStorage if available (for reconnecting to existing chat)
  useEffect(() => {
    const savedThreadId = localStorage.getItem('mpt_last_thread_id');
    if (savedThreadId && !threadId && messages.length === 1) {
      // Only restore if we're still on the initial greeting message
      setThreadId(savedThreadId);
    }
  }, []);

  const saveChatHistory = (newHistory: typeof chatHistory) => {
    setChatHistory(newHistory);
    localStorage.setItem('mpt_ai_chat_history', JSON.stringify(newHistory));
  };

  const persistMessage = async (
    threadId: string,
    role: 'user' | 'assistant',
    content: string,
    model?: string
  ) => {
    try {
      const token = localStorage.getItem('mpt_token');
      await fetch('/api/chat/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ threadId, role, content, model }),
      });
    } catch (error) {
      console.error('Background error persisting message:', error);
    }
  };

  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages]);

  // Save current thread ID and sync messages with chat history whenever messages or threadId change
  useEffect(() => {
    // Save the current thread ID to localStorage for auto-loading on page refresh
    if (threadId) {
      localStorage.setItem('mpt_last_thread_id', threadId);
    }
    
    // Sync messages with chat history whenever messages change
    if (currentChatId && messages.length > 0) {
      const updatedHistory = chatHistory.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages, date: new Date().toLocaleString('id-ID') }
          : chat
      );
      saveChatHistory(updatedHistory);
    }
  }, [messages, currentChatId, threadId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log("📁 File selected:", file.name, file.type, file.size);
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      console.error("❌ Invalid file type:", file.type);
      alert('❌ Format file tidak didukung!\n\nGunakan: JPG, PNG, atau WEBP');
      return;
    }
    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error("❌ File too large:", file.size);
      alert('❌ File terlalu besar!\n\nMaksimal: 5MB\nUkuran file Anda: ' + (file.size / 1024 / 1024).toFixed(2) + 'MB\n\n💡 Compress dulu gambarnya.');
      return;
    }
    
    console.log("✅ File validation passed, reading file...");
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log("✅ File read complete");
      setImagePreview(reader.result as string);
      setSelectedImage((reader.result as string).split(',')[1]); 
    };
    reader.onerror = () => {
      console.error("❌ File read error");
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
    
    setAiProcessing(currentImage ? 'vision' : 'buddy');

    const systemContext = getSystemContext();
    const contextualMessages = [
      { role: 'system', content: systemContext },
      ...updatedMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
    ];

    try {
      if (!threadId) {
        const token = localStorage.getItem('mpt_token');
        const threadTitle = textToSend.substring(0, 50) + (textToSend.length > 50 ? '...' : '');
        
        const threadResponse = await fetch('/api/chat/thread', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ title: threadTitle }),
        });

        if (threadResponse.ok) {
          const threadData = await threadResponse.json();
          const newThreadId = threadData.thread.id;
          setThreadId(newThreadId);
          
          persistMessage(newThreadId, 'user', userMessageContent);
        } else {
          console.warn('Failed to create thread, continuing without persistence');
        }
      } else {
        persistMessage(threadId, 'user', userMessageContent);
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: contextualMessages, 
          image: currentImage,
          language: i18n.language,
          threadId: threadId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
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
        model: data.model
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      if (threadId) {
        persistMessage(threadId, 'assistant', aiMessage.content, aiMessage.model);
      }

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
    
    let tradeContext = '';
    if (latestTrades && latestTrades.length > 0) {
      const recentTrade = latestTrades[0];
      tradeContext = `\n\nRECENT TRADE CONTEXT:\n`;
      tradeContext += `- Latest trade: ${recentTrade.pair} ${recentTrade.position}\n`;
      if (recentTrade.emotion) {
        tradeContext += `- User emotion state: ${recentTrade.emotion} ${
          recentTrade.emotion === 'Tenang' ? '😌' : 
          recentTrade.emotion === 'Takut' ? '😨' : 
          '🤑'
        }\n`;
      }
      if (recentTrade.disciplineScore !== undefined) {
        tradeContext += `- Recent discipline score: ${recentTrade.disciplineScore}%\n`;
      }
      if (recentTrade.result) {
        tradeContext += `- Last result: ${recentTrade.result} (${recentTrade.pips > 0 ? '+' : ''}${recentTrade.pips} pips)\n`;
      }
    }
    
    const modeContext = (() => {
      switch(conversationMode) {
        case 'analysis':
          return ' Focus on technical analysis: chart patterns, support/resistance, entry points, and confirmation signals.';
        case 'strategy':
          return ' Focus on strategy review: profitability, consistency, risk/reward ratio, and improvement areas.';
        case 'mindset':
          return ' Focus on psychological aspects: discipline, emotion control, confidence, and trading psychology.';
        default:
          return '';
      }
    })();
    
    return baseContext + modeContext + tradeContext;
  };

  const checkMTAViolations = (): string | null => {
    if (!latestTrades || latestTrades.length === 0) return null;
    
    const recent = latestTrades[0];
    const violations: string[] = [];
    
    if (recent.mtaCheckList && !recent.mtaCheckList.planReviewed) {
      violations.push('❌ **Violation: No Plan Review** - You didn\'t review trading plan before entry');
    }
    
    if (recent.mtaCheckList && !recent.mtaCheckList.noFearTrade) {
      violations.push('⚠️ **Risk Alert: Emotional Trading** - Seems like fear-based trading detected');
    }
    
    if (recent.riskPercent && recent.riskPercent > 2) {
      violations.push(`🚨 **Excessive Risk: ${recent.riskPercent}%** - Max allowed is 2% per trade (MPT Rule #1)`);
    }
    
    if (recent.disciplineScore !== undefined && recent.disciplineScore < 40) {
      violations.push(`📉 **Low Discipline Score: ${recent.disciplineScore}%** - Need more checklist compliance`);
    }
    
    if (violations.length > 0) {
      return `\n⚠️ **MTA AUDIT ALERT**\n\n${violations.join('\n\n')}\n\n💡 Focus on the plan, not the panic!`;
    }
    
    return null;
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
    setThreadId(null); // Clear thread ID for new chat
    setConversationMode('general');
    localStorage.removeItem('mpt_last_thread_id'); // Clear saved thread ID
  };

  const loadChat = async (chatId: string) => {
    const localChat = chatHistory.find(c => c.id === chatId);
    if (localChat && localChat.messages.length > 0) {
      setMessages(localChat.messages);
      setCurrentChatId(chatId);
      setThreadId(chatId);
      localStorage.setItem('mpt_last_thread_id', chatId); // Save for auto-load
      setShowHistory(false);
      return;
    }

    try {
      const token = localStorage.getItem('mpt_token');
      const response = await fetch(`/api/chat/history/${chatId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const loadedMessages = data.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          model: msg.model,
        }));

        setMessages(loadedMessages);
        setCurrentChatId(chatId);
        setThreadId(chatId);
        localStorage.setItem('mpt_last_thread_id', chatId); // Save for auto-load
        setShowHistory(false);
      } else {
        console.error('Failed to load chat from database');
      }
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const deleteChat = async (chatId: string) => {
    const newHistory = chatHistory.filter(c => c.id !== chatId);
    saveChatHistory(newHistory);

    try {
      const token = localStorage.getItem('mpt_token');
      await fetch(`/api/chat/thread/${chatId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Error deleting chat from database:', error);
    }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col md:flex-row overflow-hidden">
      {/* Mobile History Toggle Overlay */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setShowHistory(false)} />
      )}

      {/* DESKTOP SIDEBAR - Commander Arka Container + History */}
      <div className="hidden md:flex md:w-56 md:flex-col md:border-r md:border-cyan-500/20 md:bg-slate-900/40 md:backdrop-blur-xl md:overflow-hidden">
        {/* Arka Avatar Container - Glassmorphism */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
          {/* Glassmorphic background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Avatar */}
          <div className="relative z-10 w-48 h-48 mb-4 drop-shadow-2xl transition-transform duration-300 hover:scale-105">
            <Image
              src={`/images/mascots/commander-arka-${getPoseFromConversation(messages as any) || 'onboarding'}.png`}
              alt="Commander Arka"
              fill
              className={`object-contain transition-opacity duration-500 ${mascotOpacity}`}
              priority={false}
            />
          </div>
          
          {/* Status Card - Glassmorphism */}
          <div className="w-full bg-white/5 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 text-center space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              {getPoseFromConversation(messages as any)?.toUpperCase() || 'READY'}
            </div>
            <div className="text-[10px] text-slate-400">
              Mood: <span className="text-cyan-300 font-bold">{userEmotionState || 'NEUTRAL'}</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-[9px] text-slate-500 pt-2 border-t border-cyan-500/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              ONLINE
            </div>
          </div>
        </div>

        {/* Sidebar Chat History */}
        <div className="flex-shrink-0 border-t border-cyan-500/20 bg-slate-900/40 overflow-y-auto flex flex-col">
          <div className="p-3 border-b border-cyan-500/20">
            <h3 className="font-bold text-cyan-400 text-xs uppercase">Chat History</h3>
            <p className="text-[10px] text-slate-500">Total: {chatHistory.length}</p>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 p-2">
            {chatHistory.length === 0 ? (
              <p className="p-2 text-xs text-slate-500 text-center">No chats</p>
            ) : (
              chatHistory.map(chat => (
                <div key={chat.id} className="group">
                  <button
                    onClick={() => {
                      setMessages(chat.messages);
                      setCurrentChatId(chat.id);
                    }}
                    className="w-full text-left p-2 text-xs hover:bg-cyan-500/10 rounded transition-colors truncate text-slate-300 hover:text-cyan-300 font-mono"
                    title={chat.title}
                  >
                    {chat.title}
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-cyan-500/20 p-2">
            <button
              onClick={startNewChat}
              className="w-full py-1.5 px-2 text-xs font-mono uppercase tracking-wider bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded text-cyan-400 transition-all"
            >
              + NEW CHAT
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col min-h-screen md:min-h-0 overflow-hidden relative">
        {/* Header - Glassmorphism */}
        <div className="sticky top-0 z-20 bg-slate-950/60 backdrop-blur-xl border-b border-cyan-500/20 px-3 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="md:hidden p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <MessageCircle size={20} className="text-cyan-400" />
            </button>
            <div>
              <h1 className="text-lg md:text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">⚡ WARRIOR BUDDY</h1>
              <p className="text-[10px] md:text-xs text-slate-400 font-mono uppercase tracking-widest">Hybrid AI Mentor System</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={startNewChat}
              className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
              title="New Chat"
            >
              <RotateCw size={18} className="text-cyan-400" />
            </button>
            <button
              onClick={startNewChat}
              className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
              title="Clear Chat"
            >
              <Trash2 size={18} className="text-cyan-400" />
            </button>
            <button
              onClick={exportChat}
              className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
              title="Download Chat"
            >
              <Download size={18} className="text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Messages Container - Glassmorphism Chat */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-slate-900/50 px-3 md:px-6 py-4 md:py-6 space-y-3 md:space-y-4 safe-area-top" data-messages-container>
          <div className="space-y-3 md:space-y-4">
            {checkMTAViolations() && messages.length > 1 && (
              <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-3 md:p-4 text-red-200 text-sm shadow-lg shadow-red-500/10">
                <ReactMarkdown
                  components={{
                    p: ({...props}) => <p className="mb-1 last:mb-0" {...props} />,
                    strong: ({...props}) => <strong className="text-red-100" {...props} />,
                  }}
                >
                  {checkMTAViolations()!}
                </ReactMarkdown>
              </div>
            )}

            {messages.map((m, i) => {
              const pose = getPoseFromConversation(messages as any);
              const isMascotOpacityReduced = mascotOpacity === 'opacity-30';
              return (
                <div 
                  key={i} 
                  className={`flex gap-2 md:gap-3 animate-fade-in ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {m.role === 'assistant' && (
                    <div className={`${mascotOpacity} transition-opacity duration-300 flex-shrink-0 w-8 h-8 md:hidden`}>
                      <CommanderArkaAvatar 
                        isThinking={isLoading && i === messages.length - 1}
                        model={m.model || 'Warrior Buddy'}
                        pose={pose}
                      />
                    </div>
                  )}
                  {m.role === 'assistant' && (
                    <div>
                      {m.content.includes('LOT SIZE') && m.content.includes('Balance') ? (
                        <>
                          <RiskCalculatorTable data={m.content} />
                          <div className="bg-white/5 backdrop-blur-xl border border-cyan-500/30 text-slate-100 p-3 md:p-4 rounded-xl max-w-[95%] md:max-w-[70%] shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300">
                            <p className="text-[10px] md:text-xs text-cyan-400 font-mono mb-1.5 font-bold">[ {m.model || 'WARRIOR BUDDY'} ]</p>
                            <ReactMarkdown 
                              components={{ 
                                p: ({...props}) => <p className="text-[13px] leading-relaxed md:text-base font-mono" {...props} />,
                              }}
                            >
                              {m.content.split('Balance')[0] + m.content.split('LOT SIZE')[1]?.split('\n').slice(1).join('\n')}
                            </ReactMarkdown>
                          </div>
                        </>
                      ) : (
                        <div className="bg-white/5 backdrop-blur-xl border border-cyan-500/30 text-slate-100 p-3 md:p-4 rounded-xl max-w-[95%] md:max-w-[70%] shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300">
                          <p className="text-[10px] md:text-xs text-cyan-400 font-mono mb-1.5 font-bold">[ {m.model || 'WARRIOR BUDDY'} ]</p>
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
                  )}
                  {m.role === 'user' && (
                    <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-500/30 text-slate-100 p-3 md:p-4 rounded-xl max-w-[95%] md:max-w-[70%] text-right shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300">
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
              );
            })}
            {isLoading && (
              <div className="flex justify-start animate-fade-in gap-2 md:gap-3">
                <div className={`${mascotOpacity} transition-opacity duration-300 flex-shrink-0 w-8 h-8 md:hidden`}>
                  <CommanderArkaAvatar 
                    isThinking={true}
                    model={aiProcessing === 'vision' ? 'Warrior Vision' : 'Warrior Buddy'}
                    pose={aiProcessing === 'vision' ? 'vision' : aiProcessing === 'buddy' ? 'empty' : 'onboarding'}
                  />
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-cyan-500/30 p-3 md:p-4 rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/10">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-cyan-400 text-xs md:text-sm font-mono">
                    {aiProcessing === 'vision' ? '📸 Scanning Chart via Warrior Vision...' : '⚡ Warrior Buddy is thinking...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Mobile Floating Avatar - Draggable */}
        {!showHistory && (
          <div
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseMove={(e) => {
              if (!isDragging) return;
              setAvatarPos({
                x: Math.max(0, Math.min(e.clientX - 24, window.innerWidth - 48)),
                y: Math.max(0, Math.min(e.clientY - 24, window.innerHeight - 48))
              });
            }}
            className="md:hidden fixed bottom-24 right-3 w-12 h-12 z-30 cursor-grab active:cursor-grabbing transition-opacity duration-300 hover:opacity-100 opacity-70"
            style={{ 
              transform: `translate(${avatarPos.x}px, ${avatarPos.y}px)`,
              pointerEvents: 'auto'
            }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50 flex items-center justify-center border-2 border-cyan-400/50">
              <div className="w-10 h-10 relative">
                <Image
                  src={`/images/mascots/commander-arka-${getPoseFromConversation(messages as any) || 'onboarding'}.png`}
                  alt="Commander Arka"
                  fill
                  className="object-contain"
                  priority={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* Input Area - Glassmorphism */}
        <div className="sticky bottom-0 z-40 bg-slate-950/60 backdrop-blur-xl border-t border-cyan-500/20 flex flex-col flex-shrink-0">
          {/* TACTICAL COMMAND BAR */}
          <div className="p-3 md:p-4 border-b border-cyan-500/20 max-h-36 md:max-h-48 bg-slate-900/40 backdrop-blur-sm">
            <p className="text-[10px] text-cyan-400 mb-2 md:mb-3 font-mono uppercase tracking-widest font-bold">[ QUICK_COMMANDS ]</p>
            <div className="flex gap-2 overflow-x-auto md:grid md:grid-cols-3 md:gap-2 no-scrollbar">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmit(null, action.prompt)}
                  className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/10 rounded-lg transition-all text-left min-w-[140px] md:min-w-0 group"
                >
                  <span className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-cyan-400 group-hover:text-cyan-300 font-bold">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="px-3 md:px-4 pt-3 pb-2 md:py-3 border-b border-cyan-500/20 relative flex items-center gap-3 bg-slate-900/40 backdrop-blur-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={imagePreview} 
                alt="Chat image preview" 
                className="h-16 md:h-20 rounded-lg border-2 border-cyan-400 shadow-lg shadow-cyan-500/30"
                width={80}
                height={80}
              />
              
              {isLoading && aiProcessing === 'vision' && (
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-20 h-20">
                    <CommanderArkaAvatar pose="vision" isThinking={true} />
                  </div>
                  <div>
                    <p className="text-cyan-400 font-bold text-sm">📸 Analyzing market structure...</p>
                    <p className="text-slate-400 text-xs">Hold on, Warrior</p>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => {
                  setImagePreview(null);
                  setSelectedImage(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center transition-colors active:scale-90 shadow-lg"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* COMMAND INPUT BAR */}
          <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3 p-2.5 md:p-4 bg-slate-950 safe-area-bottom">
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
              className="p-2 md:p-3 bg-white/5 backdrop-blur-sm hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 rounded-lg transition-all flex-shrink-0"
              title="Upload Chart"
            >
              <Paperclip size={16} className="text-cyan-400/60 hover:text-cyan-400" />
            </button>

            <input
              className="flex-1 min-w-0 px-2.5 py-2 md:px-4 md:py-3 bg-white/5 backdrop-blur-sm border border-cyan-500/20 text-white text-[13px] md:text-sm font-mono placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-all uppercase tracking-wider rounded-lg focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="> COMMAND..."
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-3 md:px-5 py-2 md:py-3 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 hover:from-cyan-500/50 hover:to-blue-500/50 border border-cyan-500/50 hover:border-cyan-400 disabled:bg-slate-800/30 disabled:border-slate-700/30 disabled:cursor-not-allowed text-cyan-400 disabled:text-slate-600 font-mono font-bold text-[10px] md:text-xs uppercase tracking-wider rounded-lg transition-all flex-shrink-0 flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
            >
              <Send size={14} className="md:w-4 md:h-4" />
              <span className="hidden sm:inline">TRANSMIT</span>
            </button>
          </form>

          {/* SYSTEM STATUS - Glassmorphism */}
          <div className="text-[9px] md:text-[10px] text-slate-400 px-2 md:px-4 py-1.5 md:py-3 text-center border-t border-cyan-500/20 font-mono uppercase tracking-widest bg-slate-950/40 backdrop-blur-sm">
            <span className="text-cyan-500/60">[ MODE:</span> <span className="font-bold text-cyan-400">{conversationMode.toUpperCase()}</span> <span className="text-cyan-500/60">] [ STATUS:</span> <span className="text-green-400 font-bold">●  OPERATIONAL</span> <span className="text-cyan-500/60">]</span>
            <div className="mt-1 flex items-center justify-center gap-2 text-[8px] md:text-[9px] flex-wrap">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded-md">
                <span className="text-slate-500">VISION:</span>
                <span className="text-blue-400 font-bold">GEMINI 1.5</span>
                <Sparkles size={8} className="text-blue-400" />
              </div>
              <span className="text-slate-600">+</span>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded-md">
                <span className="text-slate-500">BRAIN:</span>
                <span className="text-purple-400 font-bold">GROQ 3.3</span>
                <Zap size={8} className="text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
