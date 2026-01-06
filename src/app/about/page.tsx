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
              {/* Photo Placeholder */}
              <div className="flex justify-center">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <div className="text-8xl">👨‍🏫</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-400" />
                  <div>
                    <h3 className="text-white font-bold">Professional Trader</h3>
                    <p className="text-gray-400 text-sm">10+ Years Experience</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="text-white font-bold">Community Builder</h3>
                    <p className="text-gray-400 text-sm">Founder of MPT Academy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="text-white font-bold">Educator & Mentor</h3>
                    <p className="text-gray-400 text-sm">Mentoring Aspiring Traders</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                  <div>
                    <h3 className="text-white font-bold">Proven Track Record</h3>
                    <p className="text-gray-400 text-sm">Consistent Profitability</p>
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
                melalui pendekatan sistematis berbasis mindset, plan, dan risk management.
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
                Membimbing setiap member dari mindset spekulan menjadi pebisnis trading profesional 
                yang mampu mengelola risiko dan emosi dengan baik.
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
                Perjalanan saya di dunia trading dimulai lebih dari 10 tahun yang lalu. Seperti kebanyakan 
                trader pemula, saya juga mengalami fase <strong className="text-white">trial and error</strong> yang 
                menguras modal dan emosi. Margin call, drawdown besar, dan trauma loss adalah bagian dari 
                pembelajaran yang pahit namun berharga.
              </p>
              
              <p>
                Titik balik terjadi ketika saya menyadari bahwa trading bukan tentang mencari <em className="text-purple-300">holy grail</em> 
                atau strategi ajaib. Trading adalah <strong className="text-white">bisnis probabilitas</strong> yang membutuhkan:
              </p>

              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Mindset</strong> - Paradigm shift dari spekulan ke pebisnis</li>
                <li><strong className="text-white">Plan</strong> - Sistem trading yang terukur dan konsisten</li>
                <li><strong className="text-white">Risk Management</strong> - Proteksi modal sebagai prioritas utama</li>
              </ul>

              <p>
                Dari pengalaman inilah lahir <strong className="text-purple-300">MPT Academy</strong> (Mindset Plan Trader). 
                Saya percaya bahwa setiap orang bisa menjadi trader sukses, asalkan bersedia belajar dengan benar, 
                disiplin mengikuti sistem, dan terus-menerus melakukan evaluasi.
              </p>

              <p>
                Melalui kurikulum yang terstruktur, saya ingin berbagi ilmu dan pengalaman agar Anda tidak perlu 
                melewati jalan panjang yang sama. <strong className="text-white">Your success is my success</strong>. 
                Mari bersama-sama menjadi <strong className="text-purple-300">Plan Warrior</strong> yang tangguh!
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
                Setiap keputusan berdasarkan data dan analisis yang terukur
              </p>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6 text-center">
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Integrity</h3>
              <p className="text-gray-400 text-sm">
                Transparansi dan kejujuran dalam setiap proses pembelajaran
              </p>
            </div>
          </Card>
        </div>

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
