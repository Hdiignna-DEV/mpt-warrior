/**
 * About Page - Founder & Head Educator
 * Profile lengkap Deden Hadiguna
 */

'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Award, 
  BookOpen, 
  Target, 
  Users, 
  TrendingUp,
  Heart,
  Shield,
  Sparkles
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 border mb-4">
            Founder & Head Educator
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Deden Hadiguna
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transforming Traders into Disciplined Plan Warriors
          </p>
        </div>

        {/* Profile Card */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Photo */}
              <div className="flex justify-center">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/images/founder-photo.jpg" 
                    alt="Deden Hadiguna" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to emoji if image not found
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<span class="text-8xl">👨‍🏫</span>';
                    }}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-400" />
                  <div>
                    <h3 className="text-white font-bold">Professional Trader</h3>
                    <p className="text-gray-400 text-sm">2+ Years Experience</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="text-white font-bold">Community Builder</h3>
                    <p className="text-gray-400 text-sm">470+ Traders Educated</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="text-white font-bold">Educator & Mentor</h3>
                    <p className="text-gray-400 text-sm">Founder of MPT Academy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                  <div>
                    <h3 className="text-white font-bold">Trading Focus</h3>
                    <p className="text-gray-400 text-sm">XAUUSD, Major Forex Pairs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Visi</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Menciptakan generasi trader Indonesia yang disiplin, profesional, dan konsisten 
                melalui pendekatan sistematis berbasis mindset, plan, dan risk management yang solid.
              </p>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-pink-400" />
                <h2 className="text-2xl font-bold text-white">Misi</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Membantu trader lain agar tidak merasakan sakitnya margin call. Membimbing setiap member 
                dari mindset spekulan menjadi pebisnis trading profesional yang patuh pada rencana.
              </p>
            </div>
          </Card>
        </div>

        {/* Story Section */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">Journey & Philosophy</h2>
            </div>
            
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Seperti kebanyakan trader pemula, saya memulai perjalanan trading dengan harapan besar 
                untuk kaya cepat. Tanpa bekal ilmu yang memadai, saya terjun langsung ke market dengan 
                modal hasil tabungan. Hasilnya? <strong className="text-red-400">Margin Call</strong>. 
                Bukan sekali, tapi berkali-kali.
              </p>
              
              <p>
                <em className="text-purple-300">"Saat itu rasanya dunia runtuh. Tapi justru dari titik terendah 
                itulah saya mulai belajar dengan serius."</em>
              </p>

              <p>
                Titik balik terjadi ketika saya menyadari bahwa trading bukan tentang mencari <em className="text-purple-300">holy grail</em> 
                atau strategi ajaib. Trading adalah <strong className="text-white">bisnis probabilitas</strong> yang membutuhkan:
              </p>

              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Mindset</strong> - Dasar dari segala tindakan, tetap tenang dalam segala kondisi market</li>
                <li><strong className="text-white">Plan</strong> - No Plan, No Trade. No Exception.</li>
                <li><strong className="text-white">Risk Management</strong> - Menjaga modal lebih penting dari mengejar profit</li>
              </ul>

              <p>
                Dari pengalaman jatuh-bangun inilah lahir <strong className="text-purple-300">MPT Academy</strong> (Mindset Plan Trader). 
                Modul ini adalah kristalisasi dari pengalaman, air mata, dan disiplin yang kami bangun.
              </p>

              <blockquote className="border-l-4 border-purple-500 pl-4 py-2 my-4 bg-purple-900/20 italic text-purple-200">
                "Trading bukan tentang seberapa cepat kita kaya, melainkan seberapa lama kita mampu 
                bertahan dan tumbuh secara konsisten di pasar."
              </blockquote>

              <p>
                Saya tidak mengajarkan cara cepat kaya. Saya mengajarkan cara <strong className="text-white">bertahan dan berkembang</strong> di 
                market yang kejam ini. Melalui kurikulum yang terstruktur, saya ingin berbagi ilmu agar Anda tidak perlu 
                melewati jalan panjang dan menyakitkan yang sama.
              </p>

              <p className="text-white font-semibold">
                Jadilah trader yang DISIPLIN. Jadilah trader yang SABAR. Jadilah trader yang RENDAH HATI.
                Dan yang terpenting: Jadilah <strong className="text-purple-300">PLAN WARRIOR</strong>.
              </p>
            </div>
          </div>
        </Card>

        {/* Core Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6 text-center">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Discipline</h3>
              <p className="text-gray-400 text-sm">
                Konsistensi dalam menjalankan plan adalah kunci kesuksesan
              </p>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6 text-center">
              <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Precision</h3>
              <p className="text-gray-400 text-sm">
                Setiap keputusan berdasarkan data dan analisis objektif dengan level kunci
              </p>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6 text-center">
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Humility</h3>
              <p className="text-gray-400 text-sm">
                Trading adalah marathon, yang menang bukan yang paling cepat tapi yang paling bertahan
              </p>
            </div>
          </Card>
        </div>

        {/* Specialization */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Spesialisasi Trading</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Instrumen
                </h3>
                <ul className="space-y-2 text-gray-300 ml-4">
                  <li>• XAUUSD (Gold) - Primary Focus</li>
                  <li>• Major Forex Pairs (EUR/USD, GBP/USD, dll)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Gaya Trading
                </h3>
                <ul className="space-y-2 text-gray-300 ml-4">
                  <li>• Intraday Trading</li>
                  <li>• Swing Trading</li>
                  <li>• Scalping (Selected setups)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Framework
                </h3>
                <ul className="space-y-2 text-gray-300 ml-4">
                  <li>• Price Action</li>
                  <li>• Support & Resistance</li>
                  <li>• Pivot Points Strategy</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Fokus Edukasi
                </h3>
                <ul className="space-y-2 text-gray-300 ml-4">
                  <li>• Psikologi Trading</li>
                  <li>• Risk Management</li>
                  <li>• Disiplin & Journaling</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Hubungi Founder</h2>
            
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <a 
                href="mailto:hadigunadeden@gmail.com" 
                className="flex items-center gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-2xl">📧</span>
                <div>
                  <div className="text-white font-semibold">Email</div>
                  <div className="text-gray-400 text-sm">hadigunadeden@gmail.com</div>
                </div>
              </a>

              <a 
                href="https://instagram.com/hdiignna" 
                className="flex items-center gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-2xl">📷</span>
                <div>
                  <div className="text-white font-semibold">Instagram</div>
                  <div className="text-gray-400 text-sm">@hdiignna</div>
                </div>
              </a>

              <a 
                href="https://t.me/hdiignna" 
                className="flex items-center gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-2xl">✈️</span>
                <div>
                  <div className="text-white font-semibold">Telegram</div>
                  <div className="text-gray-400 text-sm">@hdiignna</div>
                </div>
              </a>

              <a 
                href="https://dedenhadiguna-portofolio.vercel.app" 
                className="flex items-center gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-2xl">🌐</span>
                <div>
                  <div className="text-white font-semibold">Portfolio</div>
                  <div className="text-gray-400 text-sm">Personal Website</div>
                </div>
              </a>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Lokasi: Banyumas, Indonesia
              </p>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-sm border-purple-500/30">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Bergabunglah dengan MPT Academy dan mulai perjalanan Anda menjadi trader profesional 
              yang disiplin dan konsisten.
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href="/academy" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Learning
              </a>
              <a 
                href="/dashboard" 
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
