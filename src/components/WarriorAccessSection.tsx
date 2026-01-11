'use client';

import { useDeviceDetection, DeviceType } from '@/hooks/useDeviceDetection';
import { IOSInstallGuide } from './iOSInstallGuide';
import QRCodeGenerator from './QRCodeGenerator';
import { Download, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function WarriorAccessSection() {
  const device = useDeviceDetection();
  const [showiOSGuide, setiOSGuideOpen] = useState(false);
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // Don't render until device detection is complete
  if (!device || device.type === DeviceType.DESKTOP && device.userAgent === '') {
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* ANDROID CTA */}
      {device.isAndroid && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24"
        >
          <div className="bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-blue-600/20 rounded-3xl border border-blue-500/30 overflow-hidden">
            <div className="relative p-8 sm:p-12">
              {/* Animated Background */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
              </div>

              <div className="relative z-10 text-center space-y-6 sm:space-y-8">
                <motion.div variants={container} initial="hidden" animate="show">
                  <motion.div variants={item} className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-400/50 bg-blue-500/10 mb-4 sm:mb-6">
                    <Smartphone size={18} className="text-blue-400" />
                    <span className="text-sm font-mono text-blue-300">ANDROID WARRIORS</span>
                  </motion.div>

                  <motion.h2 variants={item} className="text-4xl sm:text-5xl font-black text-white mb-3">
                    Download MPT Trading HUB APK
                  </motion.h2>

                  <motion.p variants={item} className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                    Akses penuh ke platform trading terbaik. Instal langsung APK di perangkat Anda dan nikmati semua fitur tanpa batasan.
                  </motion.p>

                  <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/downloads/mpt-warrior.apk" download className="w-full sm:w-auto">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 sm:py-6 w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl">
                        <Download size={24} />
                        Download APK Sekarang
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 text-lg px-8 py-4 sm:py-6"
                    >
                      Versi Terbaru: 1.0.1
                    </Button>
                  </motion.div>

                  <motion.div variants={item} className="pt-4">
                    <p className="text-sm text-slate-400">
                      📱 APK kompatibel dengan Android 8.0+
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* iOS CTA */}
      {device.isIOS && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24"
        >
          <div className="bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-purple-600/20 rounded-3xl border border-purple-500/30 overflow-hidden">
            <div className="relative p-8 sm:p-12">
              {/* Animated Background */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
              </div>

              <div className="relative z-10 text-center space-y-6 sm:space-y-8">
                <motion.div variants={container} initial="hidden" animate="show">
                  <motion.div variants={item} className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-purple-400/50 bg-purple-500/10 mb-4 sm:mb-6">
                    <Smartphone size={18} className="text-purple-400" />
                    <span className="text-sm font-mono text-purple-300">IPHONE WARRIORS</span>
                  </motion.div>

                  <motion.h2 variants={item} className="text-4xl sm:text-5xl font-black text-white mb-3">
                    Install MPT Trading HUB
                  </motion.h2>

                  <motion.p variants={item} className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                    Tambahkan aplikasi ke home screen Anda. Hanya 3 langkah sederhana untuk akses penuh ke semua fitur trading profesional.
                  </motion.p>

                  <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => setiOSGuideOpen(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg px-8 py-4 sm:py-6 w-full sm:w-auto rounded-xl"
                    >
                      <Download size={24} className="mr-2" />
                      Install di iPhone
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 text-lg px-8 py-4 sm:py-6"
                    >
                      Tutorial Lengkap
                    </Button>
                  </motion.div>

                  <motion.div variants={item} className="pt-4">
                    <p className="text-sm text-slate-400">
                      🍎 Kompatibel dengan iOS 13+
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* DESKTOP QR CODE CTA */}
      {device.isDesktop && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24"
        >
          <div className="bg-gradient-to-br from-emerald-600/20 via-emerald-500/10 to-emerald-600/20 rounded-3xl border border-emerald-500/30 overflow-hidden">
            <div className="relative p-8 sm:p-12">
              {/* Animated Background */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
              </div>

              <div className="relative z-10">
                <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Text Content */}
                  <motion.div variants={item} className="space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-400/50 bg-emerald-500/10 w-fit">
                      <Monitor size={18} className="text-emerald-400" />
                      <span className="text-sm font-mono text-emerald-300">DESKTOP ACCESS</span>
                    </div>

                    <div>
                      <h2 className="text-4xl font-black text-white mb-3">
                        Akses MPT Trading HUB
                      </h2>
                      <p className="text-lg text-slate-300 mb-4">
                        Scan QR code dengan smartphone Anda untuk membuka aplikasi.
                      </p>
                      <p className="text-slate-400 text-sm">
                        Mendapatkan link download langsung untuk Android dan panduan instalasi lengkap untuk iPhone.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-emerald-400 font-bold">1</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">Buka kamera</p>
                          <p className="text-sm text-slate-400">
                            Gunakan kamera smartphone Anda
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-emerald-400 font-bold">2</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">Scan QR Code</p>
                          <p className="text-sm text-slate-400">
                            Arahkan ke QR code di samping
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-emerald-400 font-bold">3</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">Unduh aplikasi</p>
                          <p className="text-sm text-slate-400">
                            Ikuti instruksi download untuk perangkat Anda
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* QR Code */}
                  <motion.div
                    variants={item}
                    className="flex justify-center"
                  >
                    <div className="bg-white p-6 rounded-2xl shadow-2xl">
                      <QRCodeGenerator
                        value={appUrl || 'https://mpt-warrior.vercel.app'}
                        size={256}
                        level="H"
                        includeMargin
                        className="w-full"
                      />
                      <p className="text-center text-sm text-slate-600 mt-4 font-mono">
                        Scan untuk download
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* iOS Install Guide Modal */}
      <IOSInstallGuide isOpen={showiOSGuide} onClose={() => setiOSGuideOpen(false)} />
    </>
  );
}

export default WarriorAccessSection;
