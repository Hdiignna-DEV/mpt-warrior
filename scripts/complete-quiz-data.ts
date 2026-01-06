/**
 * Complete Quiz Data for MPT Academy Modules 1-3
 * Extracted from "MINDSET PLAN TRADER - MODULE.pdf"
 * 
 * This file contains all quiz questions organized by module
 * Ready to be populated into Cosmos DB
 */

export interface QuizQuestion {
  id: string;
  moduleId: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: number; // index for MC/TF
  points: number;
  order: number;
  category?: string;
}

export const MODULE_1_QUIZ: QuizQuestion[] = [
  // Paradigm Shift (Sub-bab 1.1)
  {
    id: 'mod1-q1',
    moduleId: 'module-1',
    type: 'multiple-choice',
    question: 'Apa perbedaan mendasar antara paradigma spekulan dan pebisnis dalam trading?',
    options: [
      'Spekulan fokus pada strategi teknikal, pebisnis fokus pada fundamental',
      'Spekulan mencari profit cepat dengan risiko tinggi, pebisnis membangun sistem berkelanjutan dengan risk management',
      'Spekulan trading penuh waktu, pebisnis trading paruh waktu',
      'Spekulan menggunakan leverage tinggi, pebisnis tidak menggunakan leverage'
    ],
    correctAnswer: 1,
    points: 10,
    order: 1,
    category: 'Paradigm'
  },
  {
    id: 'mod1-q2',
    moduleId: 'module-1',
    type: 'true-false',
    question: 'Trading adalah bisnis investasi yang membutuhkan modal, sistem, dan manajemen risiko—bukan judi keberuntungan.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    points: 5,
    order: 2,
    category: 'Paradigm'
  },
  {
    id: 'mod1-q3',
    moduleId: 'module-1',
    type: 'multiple-choice',
    question: 'Menurut MPT, apa yang harus menjadi fokus utama trader profesional?',
    options: [
      'Mencari setup dengan win rate 100%',
      'Mendapatkan profit maksimal setiap hari',
      'Melindungi modal dan mengikuti proses yang benar',
      'Mengejar target profit bulanan'
    ],
    correctAnswer: 2,
    points: 10,
    order: 3,
    category: 'Paradigm'
  },

  // Emotion Management (Sub-bab 1.2)
  {
    id: 'mod1-q4',
    moduleId: 'module-1',
    type: 'multiple-choice',
    question: 'Apa tiga emosi destruktif utama dalam trading menurut MPT?',
    options: [
      'Marah, Senang, Sedih',
      'Greed, Fear, Hope',
      'Optimis, Pesimis, Realis',
      'Confidence, Doubt, Anxiety'
    ],
    correctAnswer: 1,
    points: 10,
    order: 4,
    category: 'Psychology'
  },
  {
    id: 'mod1-q5',
    moduleId: 'module-1',
    type: 'essay',
    question: 'Jelaskan dampak negatif dari emosi GREED (keserakahan) dalam trading dan sebutkan minimal 2 teknik untuk menetralisirnya.',
    points: 15,
    order: 5,
    category: 'Psychology'
  },
  {
    id: 'mod1-q6',
    moduleId: 'module-1',
    type: 'true-false',
    question: 'Seorang trader yang mengalami profit 100 pips lalu tidak close karena ingin lebih banyak sedang dikuasai oleh emosi FEAR (ketakutan).',
    options: ['Benar', 'Salah'],
    correctAnswer: 1, // Salah, itu GREED
    points: 5,
    order: 6,
    category: 'Psychology'
  },
  {
    id: 'mod1-q7',
    moduleId: 'module-1',
    type: 'multiple-choice',
    question: 'Seorang trader menahan floating loss dengan harapan harga akan berbalik, tidak mau cut loss. Emosi apa yang sedang mendominasi?',
    options: [
      'Greed (Keserakahan)',
      'Fear (Ketakutan)',
      'Hope (Harapan Palsu)',
      'Confidence (Kepercayaan Diri)'
    ],
    correctAnswer: 2,
    points: 10,
    order: 7,
    category: 'Psychology'
  },

  // Probability (Sub-bab 1.3)
  {
    id: 'mod1-q8',
    moduleId: 'module-1',
    type: 'multiple-choice',
    question: 'Jika sistem trading memiliki win rate 50% dengan RRR 1:2, berapa break-even win rate?',
    options: [
      '50%',
      '40%',
      '33%',
      '25%'
    ],
    correctAnswer: 2, // 33% untuk RRR 1:2
    points: 10,
    order: 8,
    category: 'Probability'
  },
  {
    id: 'mod1-q9',
    moduleId: 'module-1',
    type: 'true-false',
    question: 'Losing streak (loss berturut-turut) adalah hal yang abnormal dan menandakan sistem trading yang buruk.',
    options: ['Benar', 'Salah'],
    correctAnswer: 1, // Salah, losing streak normal dan pasti terjadi
    points: 5,
    order: 9,
    category: 'Probability'
  },
  {
    id: 'mod1-q10',
    moduleId: 'module-1',
    type: 'essay',
    question: 'Bandingkan 3 trader berikut dan jelaskan mana yang paling profitable dalam jangka panjang:\n- Trader A: Win rate 80%, RRR 1:0.5\n- Trader B: Win rate 50%, RRR 1:2\n- Trader C: Win rate 40%, RRR 1:3\n(Gunakan expectancy formula untuk menjelaskan)',
    points: 20,
    order: 10,
    category: 'Probability'
  },
  {
    id: 'mod1-q11',
    moduleId: 'module-1',
    type: 'multiple-choice',
    question: 'Berapa minimal jumlah trade yang diperlukan untuk evaluasi sistem trading secara reliable?',
    options: [
      '5-10 trade',
      '10-20 trade',
      '30-50 trade',
      '100+ trade'
    ],
    correctAnswer: 3,
    points: 10,
    order: 11,
    category: 'Probability'
  },

  // Discipline (Sub-bab 1.4)
  {
    id: 'mod1-q12',
    moduleId: 'module-1',
    type: 'true-false',
    question: 'Profit yang didapat dari trading tanpa plan dan tanpa SL adalah kesuksesan yang harus dirayakan.',
    options: ['Benar', 'Salah'],
    correctAnswer: 1, // Salah
    points: 5,
    order: 12,
    category: 'Discipline'
  },
  {
    id: 'mod1-q13',
    moduleId: 'module-1',
    type: 'multiple-choice',
    question: 'Apa yang dimaksud dengan framework "4R" dalam membangun habit disiplin MPT?',
    options: [
      'Risk, Reward, Ratio, Result',
      'Ritual, Rules, Reward, Repercussion',
      'Research, Read, Review, Repeat',
      'Realize, Respond, Recover, Rebuild'
    ],
    correctAnswer: 1,
    points: 10,
    order: 13,
    category: 'Discipline'
  },
  {
    id: 'mod1-q14',
    moduleId: 'module-1',
    type: 'essay',
    question: 'Jelaskan mengapa "disiplin lebih penting dari hasil" dalam trading. Berikan contoh skenario loss dengan disiplin yang lebih baik daripada profit tanpa disiplin.',
    points: 15,
    order: 14,
    category: 'Discipline'
  },
  {
    id: 'mod1-q15',
    moduleId: 'module-1',
    type: 'multiple-choice',
    question: 'Menurut MPT, apa yang harus dilakukan jika Anda entry tanpa trading plan?',
    options: [
      'Lanjutkan trade dengan hati-hati',
      'Close posisi dan stop trading 1 hari sebagai konsekuensi',
      'Buat plan sambil posisi berjalan',
      'Tidak masalah selama hasilnya profit'
    ],
    correctAnswer: 1,
    points: 10,
    order: 15,
    category: 'Discipline'
  }
];

export const MODULE_2_QUIZ: QuizQuestion[] = [
  // RPT 1% (Sub-bab 2.1)
  {
    id: 'mod2-q1',
    moduleId: 'module-2',
    type: 'essay',
    question: 'Equity $1,500, berapa maksimal risk per trade dengan RPT 1%? Tunjukkan perhitungan Anda.',
    points: 10,
    order: 1,
    category: 'RPT'
  },
  {
    id: 'mod2-q2',
    moduleId: 'module-2',
    type: 'multiple-choice',
    question: 'Apa kepanjangan RPT dalam sistem risk management MPT?',
    options: [
      'Return Per Trade',
      'Risk Per Trade',
      'Ratio Profit Target',
      'Risk Protection Tool'
    ],
    correctAnswer: 1,
    points: 5,
    order: 2,
    category: 'RPT'
  },
  {
    id: 'mod2-q3',
    moduleId: 'module-2',
    type: 'true-false',
    question: 'Jika balance $5,000 dan floating loss -$250, maka risk untuk trade berikutnya dihitung dari equity ($4,750), bukan balance.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    points: 5,
    order: 3,
    category: 'RPT'
  },
  {
    id: 'mod2-q4',
    moduleId: 'module-2',
    type: 'essay',
    question: 'Mengapa RPT 1% lebih baik dari 5% atau 10%? Jelaskan dengan konsep "Recovery Math" dan berapa persen recovery yang dibutuhkan untuk loss 50%.',
    points: 15,
    order: 4,
    category: 'RPT'
  },

  // Margin & Leverage (Sub-bab 2.2)
  {
    id: 'mod2-q5',
    moduleId: 'module-2',
    type: 'multiple-choice',
    question: 'Apa rekomendasi leverage maksimal MPT untuk trader pemula?',
    options: [
      '1:1000',
      '1:500',
      '1:100',
      '1:50'
    ],
    correctAnswer: 2, // 1:100
    points: 10,
    order: 5,
    category: 'Leverage'
  },
  {
    id: 'mod2-q6',
    moduleId: 'module-2',
    type: 'true-false',
    question: 'Leverage tinggi (misal 1:500) secara otomatis membuat trading lebih berisiko.',
    options: ['Benar', 'Salah'],
    correctAnswer: 1, // Salah - leverage hanya alat, risk ditentukan oleh lot
    points: 5,
    order: 6,
    category: 'Leverage'
  },
  {
    id: 'mod2-q7',
    moduleId: 'module-2',
    type: 'multiple-choice',
    question: 'Apa perbedaan antara MARGIN dan RISK dalam trading?',
    options: [
      'Margin adalah jaminan, Risk adalah potensi kerugian maksimal',
      'Margin sama dengan Risk',
      'Margin lebih besar dari Risk',
      'Risk adalah leverage dikali margin'
    ],
    correctAnswer: 0,
    points: 10,
    order: 7,
    category: 'Leverage'
  },

  // Lot Calculation (Sub-bab 2.3)
  {
    id: 'mod2-q8',
    moduleId: 'module-2',
    type: 'essay',
    question: 'Risk $15, SL 150 pips, pair XAUUSD (nilai per 0.01 lot = $0.15/pip). Hitung berapa lot yang harus digunakan! Tunjukkan formula dan langkah perhitungan.',
    points: 20,
    order: 8,
    category: 'LotCalculation'
  },
  {
    id: 'mod2-q9',
    moduleId: 'module-2',
    type: 'multiple-choice',
    question: 'Formula master kalkulasi lot MPT adalah:',
    options: [
      'Lot = Risk / (SL × Leverage)',
      'Lot = Risk / (SL × Pip Value)',
      'Lot = Equity × 0.01',
      'Lot = Balance / 100'
    ],
    correctAnswer: 1,
    points: 10,
    order: 9,
    category: 'LotCalculation'
  },
  {
    id: 'mod2-q10',
    moduleId: 'module-2',
    type: 'true-false',
    question: 'Untuk pair XAUUSD, nilai per pip untuk 0.01 lot adalah $1.',
    options: ['Benar', 'Salah'],
    correctAnswer: 1, // Salah - $0.15 per pip
    points: 5,
    order: 10,
    category: 'LotCalculation'
  },

  // RRR (Sub-bab 2.4)
  {
    id: 'mod2-q11',
    moduleId: 'module-2',
    type: 'essay',
    question: 'Dengan RRR 1:2, berapa break-even win rate? Tunjukkan formula dan perhitungan.',
    points: 15,
    order: 11,
    category: 'RRR'
  },
  {
    id: 'mod2-q12',
    moduleId: 'module-2',
    type: 'multiple-choice',
    question: 'Jika SL = 50 pips dan RRR standar MPT 1:2, maka TP harus ditempatkan di:',
    options: [
      '50 pips',
      '75 pips',
      '100 pips',
      '150 pips'
    ],
    correctAnswer: 2, // 100 pips (50 × 2)
    points: 10,
    order: 12,
    category: 'RRR'
  },
  {
    id: 'mod2-q13',
    moduleId: 'module-2',
    type: 'true-false',
    question: 'RRR 1:2 berarti jika risk $10, maka target profit harus $20.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    points: 5,
    order: 13,
    category: 'RRR'
  },

  // Drawdown (Sub-bab 2.5)
  {
    id: 'mod2-q14',
    moduleId: 'module-2',
    type: 'essay',
    question: 'Drawdown berapa persen yang mengharuskan Anda stop trading 1 minggu menurut protokol MPT? Jelaskan alasannya.',
    points: 15,
    order: 14,
    category: 'Drawdown'
  },
  {
    id: 'mod2-q15',
    moduleId: 'module-2',
    type: 'essay',
    question: 'Jika akun mengalami drawdown 30%, berapa persen recovery yang dibutuhkan untuk kembali ke modal awal? Tunjukkan perhitungan!',
    points: 20,
    order: 15,
    category: 'Drawdown'
  },
  {
    id: 'mod2-q16',
    moduleId: 'module-2',
    type: 'multiple-choice',
    question: 'Menurut batas drawdown MPT, pada level berapa trader harus STOP SELAMANYA dan evaluasi total?',
    options: [
      '5%',
      '10%',
      '15%',
      '20%'
    ],
    correctAnswer: 3, // 20%
    points: 10,
    order: 16,
    category: 'Drawdown'
  },
  {
    id: 'mod2-q17',
    moduleId: 'module-2',
    type: 'true-false',
    question: 'Drawdown 10% membutuhkan recovery 10% untuk kembali ke modal awal.',
    options: ['Benar', 'Salah'],
    correctAnswer: 1, // Salah - butuh 11.11%
    points: 5,
    order: 17,
    category: 'Drawdown'
  }
];

export const MODULE_3_QUIZ: QuizQuestion[] = [
  // Market Structure (Sub-bab 3.1)
  {
    id: 'mod3-q1',
    moduleId: 'module-3',
    type: 'multiple-choice',
    question: 'Apa ciri-ciri UPTREND dalam market structure?',
    options: [
      'Higher High (HH) dan Higher Low (HL)',
      'Lower High (LH) dan Lower Low (LL)',
      'Equal High dan Equal Low',
      'Harga bergerak horizontal'
    ],
    correctAnswer: 0,
    points: 10,
    order: 1,
    category: 'Structure'
  },
  {
    id: 'mod3-q2',
    moduleId: 'module-3',
    type: 'true-false',
    question: 'Dalam DOWNTREND, strategi utama adalah mencari peluang SELL di area pullback (Lower High).',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    points: 5,
    order: 2,
    category: 'Structure'
  },
  {
    id: 'mod3-q3',
    moduleId: 'module-3',
    type: 'essay',
    question: 'Jelaskan perbedaan antara BOS (Break of Structure) dan CHoCH (Change of Character) serta signifikansinya dalam trading.',
    points: 15,
    order: 3,
    category: 'Structure'
  },
  {
    id: 'mod3-q4',
    moduleId: 'module-3',
    type: 'multiple-choice',
    question: 'Market SIDEWAYS sebaiknya ditradingkan dengan strategi:',
    options: [
      'Breakout saja',
      'Buy di support, Sell di resistance (range trading)',
      'Hindari trading sama sekali',
      'Entry di tengah range'
    ],
    correctAnswer: 1,
    points: 10,
    order: 4,
    category: 'Structure'
  },

  // Pivot Point (Sub-bab 3.2)
  {
    id: 'mod3-q5',
    moduleId: 'module-3',
    type: 'multiple-choice',
    question: 'Formula Pivot Point klasik adalah:',
    options: [
      'P = (High + Low) / 2',
      'P = (High + Low + Close) / 3',
      'P = (Open + High + Low + Close) / 4',
      'P = Close'
    ],
    correctAnswer: 1,
    points: 10,
    order: 5,
    category: 'Pivot'
  },
  {
    id: 'mod3-q6',
    moduleId: 'module-3',
    type: 'true-false',
    question: 'Jika harga berada DI ATAS Pivot Point, bias trading adalah BULLISH.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    points: 5,
    order: 6,
    category: 'Pivot'
  },
  {
    id: 'mod3-q7',
    moduleId: 'module-3',
    type: 'essay',
    question: 'High kemarin = 2650, Low kemarin = 2600, Close kemarin = 2640. Hitung Pivot Point (P), R1, dan S1. Tunjukkan formula dan perhitungan lengkap!',
    points: 20,
    order: 7,
    category: 'Pivot'
  },
  {
    id: 'mod3-q8',
    moduleId: 'module-3',
    type: 'multiple-choice',
    question: 'Level Pivot Point yang paling kuat sebagai support/resistance adalah:',
    options: [
      'R3/S3',
      'R2/S2',
      'R1/S1',
      'Central Pivot (P)'
    ],
    correctAnswer: 3,
    points: 10,
    order: 8,
    category: 'Pivot'
  },

  // Support & Resistance (Sub-bab 3.3)
  {
    id: 'mod3-q9',
    moduleId: 'module-3',
    type: 'true-false',
    question: 'Support dan Resistance adalah ZONA (zone), bukan garis presisi yang tepat.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    points: 5,
    order: 9,
    category: 'SR'
  },
  {
    id: 'mod3-q10',
    moduleId: 'module-3',
    type: 'multiple-choice',
    question: 'Level S/R yang paling kuat adalah yang berasal dari timeframe:',
    options: [
      'M5',
      'M15',
      'H1',
      'Daily atau Weekly'
    ],
    correctAnswer: 3,
    points: 10,
    order: 10,
    category: 'SR'
  },
  {
    id: 'mod3-q11',
    moduleId: 'module-3',
    type: 'essay',
    question: 'Jelaskan konsep "Support Become Resistance (SBR)" dan "Resistance Become Support (RBS)" disertai contoh skenario trading.',
    points: 15,
    order: 11,
    category: 'SR'
  },
  {
    id: 'mod3-q12',
    moduleId: 'module-3',
    type: 'multiple-choice',
    question: 'Level S/R yang belum pernah di-test (FRESH) memiliki kekuatan:',
    options: [
      'Lebih lemah dari level yang sudah tested',
      'Sama dengan level tested',
      'Lebih kuat dari level tested',
      'Tidak valid untuk trading'
    ],
    correctAnswer: 2,
    points: 10,
    order: 12,
    category: 'SR'
  },

  // Kunci Atas & Bawah (Sub-bab 3.4)
  {
    id: 'mod3-q13',
    moduleId: 'module-3',
    type: 'multiple-choice',
    question: 'Waktu sesi Asia menurut sistem Kunci Atas & Bawah MPT adalah:',
    options: [
      '00:00 - 08:00 WIB',
      '04:00 - 14:00 WIB',
      '08:00 - 16:00 WIB',
      '14:00 - 22:00 WIB'
    ],
    correctAnswer: 1,
    points: 10,
    order: 13,
    category: 'SessionKey'
  },
  {
    id: 'mod3-q14',
    moduleId: 'module-3',
    type: 'true-false',
    question: 'Kunci Atas adalah HIGH sesi Asia, dan Kunci Bawah adalah LOW sesi Asia.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    points: 5,
    order: 14,
    category: 'SessionKey'
  },
  {
    id: 'mod3-q15',
    moduleId: 'module-3',
    type: 'essay',
    question: 'Jelaskan strategi trading dengan teknik Kunci Atas & Bawah. Kapan waktu optimal untuk entry dan bagaimana validasi breakout yang benar?',
    points: 20,
    order: 15,
    category: 'SessionKey'
  },
  {
    id: 'mod3-q16',
    moduleId: 'module-3',
    type: 'multiple-choice',
    question: 'Breakout Kunci paling valid terjadi pada sesi:',
    options: [
      'Sesi Asia',
      'Sesi London (awal)',
      'Sesi New York',
      'Overlap Asia-London'
    ],
    correctAnswer: 1,
    points: 10,
    order: 16,
    category: 'SessionKey'
  },

  // Multi-Timeframe Analysis (Sub-bab 3.5)
  {
    id: 'mod3-q17',
    moduleId: 'module-3',
    type: 'multiple-choice',
    question: 'Dalam analisis Multi-Timeframe MPT, fungsi H4 adalah:',
    options: [
      'Eksekusi entry',
      'Konfirmasi trend',
      'Navigasi - menentukan bias dan arah utama',
      'Scalping'
    ],
    correctAnswer: 2,
    points: 10,
    order: 17,
    category: 'MTA'
  },
  {
    id: 'mod3-q18',
    moduleId: 'module-3',
    type: 'true-false',
    question: 'Entry hanya boleh dilakukan jika minimal 2 dari 3 timeframe (H4, H1, M15) aligned.',
    options: ['Benar', 'Salah'],
    correctAnswer: 0,
    points: 5,
    order: 18,
    category: 'MTA'
  },
  {
    id: 'mod3-q19',
    moduleId: 'module-3',
    type: 'essay',
    question: 'Skenario: H4 bullish, H1 sedang pullback bearish, M15 ranging. Apa keputusan trading Anda dan alasannya? Jelaskan dengan prinsip Multi-Timeframe Analysis MPT.',
    points: 20,
    order: 19,
    category: 'MTA'
  },
  {
    id: 'mod3-q20',
    moduleId: 'module-3',
    type: 'multiple-choice',
    question: 'Urutan analisis Multi-Timeframe yang benar adalah:',
    options: [
      'M15 → H1 → H4',
      'H1 → M15 → H4',
      'H4 → H1 → M15',
      'Tidak ada urutan, bisa mulai dari mana saja'
    ],
    correctAnswer: 2,
    points: 10,
    order: 20,
    category: 'MTA'
  }
];

// Summary
export const QUIZ_SUMMARY = {
  module1: {
    totalQuestions: MODULE_1_QUIZ.length,
    totalPoints: MODULE_1_QUIZ.reduce((sum, q) => sum + q.points, 0),
    breakdown: {
      multipleChoice: MODULE_1_QUIZ.filter(q => q.type === 'multiple-choice').length,
      trueFalse: MODULE_1_QUIZ.filter(q => q.type === 'true-false').length,
      essay: MODULE_1_QUIZ.filter(q => q.type === 'essay').length
    }
  },
  module2: {
    totalQuestions: MODULE_2_QUIZ.length,
    totalPoints: MODULE_2_QUIZ.reduce((sum, q) => sum + q.points, 0),
    breakdown: {
      multipleChoice: MODULE_2_QUIZ.filter(q => q.type === 'multiple-choice').length,
      trueFalse: MODULE_2_QUIZ.filter(q => q.type === 'true-false').length,
      essay: MODULE_2_QUIZ.filter(q => q.type === 'essay').length
    }
  },
  module3: {
    totalQuestions: MODULE_3_QUIZ.length,
    totalPoints: MODULE_3_QUIZ.reduce((sum, q) => sum + q.points, 0),
    breakdown: {
      multipleChoice: MODULE_3_QUIZ.filter(q => q.type === 'multiple-choice').length,
      trueFalse: MODULE_3_QUIZ.filter(q => q.type === 'true-false').length,
      essay: MODULE_3_QUIZ.filter(q => q.type === 'essay').length
    }
  }
};

console.log('Quiz Data Summary:');
console.log('=================');
console.log('Module 1:', QUIZ_SUMMARY.module1);
console.log('Module 2:', QUIZ_SUMMARY.module2);
console.log('Module 3:', QUIZ_SUMMARY.module3);
console.log('\nTotal Questions:', 
  MODULE_1_QUIZ.length + MODULE_2_QUIZ.length + MODULE_3_QUIZ.length);
console.log('Total Points:', 
  QUIZ_SUMMARY.module1.totalPoints + QUIZ_SUMMARY.module2.totalPoints + QUIZ_SUMMARY.module3.totalPoints);
