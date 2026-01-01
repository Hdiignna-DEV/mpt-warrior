'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, X, Save, Image as ImageIcon } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  pair: string;
  trade: {
    entry: number;
    exit: number;
    stopLoss: number;
    takeProfit: number;
    pips: number;
    result: 'WIN' | 'LOSS';
  };
  emotionalState: 'calm' | 'confident' | 'nervous' | 'frustrated' | 'excited';
  notes: string;
  screenShot?: string;
  tags: string[];
  lessonLearned?: string;
}

interface TradeJournalProps {
  onSave?: (entry: JournalEntry) => void;
}

export default function TradeJournal({ onSave }: TradeJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'WIN' | 'LOSS'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<JournalEntry>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    pair: '',
    trade: {
      entry: 0,
      exit: 0,
      stopLoss: 0,
      takeProfit: 0,
      pips: 0,
      result: 'WIN',
    },
    emotionalState: 'calm',
    notes: '',
    tags: [],
    lessonLearned: '',
  });

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mpt_journal_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading journal entries:', error);
      }
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('mpt_journal_entries', JSON.stringify(entries));
  }, [entries]);

  const calculatePips = (entry: number, exit: number, posisi: string) => {
    if (posisi === 'BUY') return (exit - entry) * 10000;
    return (entry - exit) * 10000;
  };

  const handleAddEntry = () => {
    setFormData({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      pair: '',
      trade: {
        entry: 0,
        exit: 0,
        stopLoss: 0,
        takeProfit: 0,
        pips: 0,
        result: 'WIN',
      },
      emotionalState: 'calm',
      notes: '',
      tags: [],
      lessonLearned: '',
    });
    setEditingId(null);
    setIsOpen(true);
  };

  const handleSaveEntry = () => {
    if (!formData.pair || formData.trade.entry === 0) {
      alert('Please fill in pair and entry price');
      return;
    }

    const pips = calculatePips(formData.trade.entry, formData.trade.exit, 'BUY');

    const entry: JournalEntry = {
      ...formData,
      trade: {
        ...formData.trade,
        pips,
      },
      id: editingId || Date.now().toString(),
    };

    if (editingId) {
      setEntries(entries.map((e) => (e.id === editingId ? entry : e)));
      setEditingId(null);
    } else {
      setEntries([entry, ...entries]);
    }

    onSave?.(entry);
    setIsOpen(false);
    setFormData({
      id: '',
      date: new Date().toISOString().split('T')[0],
      pair: '',
      trade: {
        entry: 0,
        exit: 0,
        stopLoss: 0,
        takeProfit: 0,
        pips: 0,
        result: 'WIN',
      },
      emotionalState: 'calm',
      notes: '',
      tags: [],
      lessonLearned: '',
    });
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setEntries(entries.filter((e) => e.id !== id));
    }
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setFormData(entry);
    setEditingId(entry.id);
    setIsOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          screenShot: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || entry.trade.result === filterType;
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => entry.tags.includes(tag));

    return matchesSearch && matchesFilter && matchesTags;
  });

  const allTags = [...new Set(entries.flatMap((e) => e.tags))];

  const emotionalStateColors: Record<JournalEntry['emotionalState'], string> = {
    calm: 'bg-blue-500/20 text-blue-400 border-blue-500',
    confident: 'bg-green-500/20 text-green-400 border-green-500',
    nervous: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
    frustrated: 'bg-red-500/20 text-red-400 border-red-500',
    excited: 'bg-purple-500/20 text-purple-400 border-purple-500',
  };

  const emotionalStateEmoji: Record<JournalEntry['emotionalState'], string> = {
    calm: '😌',
    confident: '💪',
    nervous: '😰',
    frustrated: '😤',
    excited: '🤩',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-yellow-400">📖 Trading Journal</h2>
        <button
          onClick={handleAddEntry}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
        >
          <Plus size={20} />
          New Entry
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search entries by pair or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="all">All Results</option>
            <option value="WIN">Wins Only</option>
            <option value="LOSS">Losses Only</option>
          </select>
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setSelectedTags(
                    selectedTags.includes(tag)
                      ? selectedTags.filter((t) => t !== tag)
                      : [...selectedTags, tag]
                  )
                }
                className={`px-3 py-1 rounded-full text-sm border transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-yellow-500/30 border-yellow-500 text-yellow-400'
                    : 'bg-slate-700/50 border-slate-600 text-slate-400'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border-2 border-yellow-500 w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-yellow-400">
                {editingId ? '✏️ Edit Entry' : '📝 New Journal Entry'}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Date & Pair */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                />
                <input
                  type="text"
                  placeholder="Pair (e.g. EURUSD)"
                  value={formData.pair}
                  onChange={(e) => setFormData({ ...formData, pair: e.target.value.toUpperCase() })}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              {/* Trade Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Entry Price</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.trade.entry}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trade: { ...formData.trade, entry: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Exit Price</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.trade.exit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trade: { ...formData.trade, exit: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              {/* Result & Emotional State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Result</label>
                  <select
                    value={formData.trade.result}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trade: { ...formData.trade, result: e.target.value as 'WIN' | 'LOSS' },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="WIN">✅ Win</option>
                    <option value="LOSS">❌ Loss</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Mood</label>
                  <select
                    value={formData.emotionalState}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emotionalState: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="calm">😌 Calm</option>
                    <option value="confident">💪 Confident</option>
                    <option value="nervous">😰 Nervous</option>
                    <option value="frustrated">😤 Frustrated</option>
                    <option value="excited">🤩 Excited</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm text-slate-400">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="What happened during this trade? Any insights?"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 h-24 resize-none"
                />
              </div>

              {/* Lesson Learned */}
              <div>
                <label className="text-sm text-slate-400">Lesson Learned</label>
                <textarea
                  value={formData.lessonLearned}
                  onChange={(e) => setFormData({ ...formData, lessonLearned: e.target.value })}
                  placeholder="What did you learn from this trade?"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 h-20 resize-none"
                />
              </div>

              {/* Screenshot */}
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-dashed border-slate-500 rounded-lg text-slate-300 transition-colors flex items-center justify-center gap-2"
                >
                  <ImageIcon size={20} />
                  {formData.screenShot ? 'Screenshot Added' : 'Add Screenshot'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveEntry}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No journal entries yet. Start documenting your trades! 📝</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-slate-800/50 border-2 border-slate-700 hover:border-yellow-500 rounded-xl p-4 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-yellow-400">{entry.pair}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold border ${
                        entry.trade.result === 'WIN'
                          ? 'bg-green-500/20 text-green-400 border-green-500'
                          : 'bg-red-500/20 text-red-400 border-red-500'
                      }`}
                    >
                      {entry.trade.result === 'WIN' ? '✅ WIN' : '❌ LOSS'}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-sm border ${emotionalStateColors[entry.emotionalState]}`}
                    >
                      {emotionalStateEmoji[entry.emotionalState]} {entry.emotionalState}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 mb-2">📅 {new Date(entry.date).toLocaleDateString('id-ID')}</p>

                  {entry.notes && (
                    <p className="text-sm text-slate-300 mb-2">
                      <strong>Notes:</strong> {entry.notes}
                    </p>
                  )}

                  {entry.lessonLearned && (
                    <p className="text-sm text-cyan-400 mb-2">
                      <strong>💡 Lesson:</strong> {entry.lessonLearned}
                    </p>
                  )}

                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditEntry(entry)}
                    className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500 rounded-lg transition-colors"
                    title="Edit entry"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500 rounded-lg transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
