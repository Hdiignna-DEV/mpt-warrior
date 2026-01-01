'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Send, Paperclip, X, Sparkles, Zap, Brain, TrendingUp, Shield, Target } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | null, overrideInput?: string) => {
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
      const aiMessage = data.choices[0].message;
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: '⚠️ Gagal koneksi ke AI. Cek API Key atau koneksi internet.' 
      }]);
    } finally {
      setIsLoading(false);
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
    <div className="flex flex-col h-screen bg-slate-950">
      {/* Header */}
      <header className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Bot className="text-purple-500" size={24} />
        </div>
        <div>
          <h1 className="font-bold text-xl text-yellow-500">AI Mentor</h1>
          <p className="text-xs text-slate-400">Analisa Chart & Trading Guidance</p>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${
              m.role === 'user' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-slate-900 border border-slate-800'
            } p-4 rounded-2xl`}>
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
                    code: ({...props}) => <code className="bg-slate-800 px-2 py-1 rounded text-xs" {...props} />
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-400">
                <div className="animate-spin">⚙️</div>
                <span className="text-sm italic">Sedang analisa...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-900 p-6 border-t border-slate-800">
        {/* Quick Actions - Grid */}
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-3 font-semibold">⚡ QUICK ACTIONS</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleSubmit(null, action.prompt)}
                className="flex flex-col items-start gap-1.5 p-3 bg-slate-800 border border-slate-700 rounded-lg hover:border-purple-500 hover:bg-slate-700 transition-all group text-left text-xs"
              >
                <span className="text-slate-400 group-hover:text-purple-400 transition-colors">{action.icon}</span>
                <span className="text-slate-300 group-hover:text-white font-semibold text-xs">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-3 relative w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imagePreview} 
              alt="Chat image preview" 
              className="h-20 rounded-lg border-2 border-yellow-500"
              width={80}
              height={80}
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
            placeholder="Tanya apa atau upload chart..."
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

        {/* Footer Info */}
        <p className="text-xs text-slate-500 mt-3 text-center">💡 Upload chart atau pilih quick action untuk guidance</p>
      </div>
    </div>
  );
}