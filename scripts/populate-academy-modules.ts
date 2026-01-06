/**
 * Script to populate Academy Module Content into Cosmos DB
 * Run: npx tsx scripts/populate-academy-modules.ts
 * 
 * This script populates the educational-modules container with
 * structured module data from The Plan Warrior Blueprint PDF
 */

import { CosmosClient } from '@azure/cosmos';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

const endpoint = process.env.AZURE_COSMOS_ENDPOINT!;
const key = process.env.AZURE_COSMOS_KEY!;
const databaseId = process.env.AZURE_COSMOS_DATABASE || 'MPTDatabase';
const containerId = 'educational-modules';

if (!endpoint || !key) {
  console.error('❌ Missing AZURE_COSMOS_ENDPOINT or AZURE_COSMOS_KEY in .env.local');
  process.exit(1);
}

const client = new CosmosClient({ endpoint, key });

// Module 1: The Warrior Mindset - Psychology
const MODULE_1_CONTENT = {
  id: 'module-1',
  moduleNumber: 1,
  title: 'THE WARRIOR MINDSET',
  subtitle: 'Psychology & Mental Framework',
  description: 'Master the psychological foundation of trading. Transform from speculator to professional investor with disciplined mindset.',
  level: 'RECRUIT',
  order: 1,
  isAvailable: true,
  estimatedHours: 3,
  totalPoints: 150,
  prerequisites: [],
  lessons: [
    {
      id: 'module-1-lesson-1',
      order: 1,
      title: '1.1 Pergeseran Paradigma: Dari Spekulan Menjadi Pebisnis Investasi',
      content: `
# 1.1 Pergeseran Paradigma: Dari Spekulan Menjadi Pebisnis Investasi

## Pendahuluan
Langkah pertama dalam transformasi menjadi Plan Warrior adalah mengubah cara Anda memandang trading. Ini bukan sekadar perubahan teknik—ini adalah perubahan IDENTITAS.

Ketika seseorang bertanya "Apa pekerjaanmu?", jawaban Anda bukan lagi "Saya mencoba trading" atau "Saya main saham/forex." Jawaban Anda adalah: "Saya adalah pebisnis pasar keuangan."

## Perbedaan Mendasar: Spekulan vs Pebisnis

| Aspek | SPEKULAN | PEBISNIS (Plan Warrior) |
|-------|----------|------------------------|
| Tujuan | Kaya cepat | Kaya konsisten dalam jangka panjang |
| Dasar Keputusan | Feeling, rumor, FOMO | Data, analisis, dan rencana tertulis |
| Pandangan terhadap Loss | Kegagalan, kesalahan fatal | Biaya operasional bisnis |
| Risiko | Diabaikan atau tidak dihitung | Dikalkulasi dengan presisi |
| Dokumentasi | Tidak ada atau jarang | Jurnal lengkap setiap trade |
| Ekspektasi | Profit setiap hari | Profit dalam periode tertentu |

## Mengapa Pergeseran Ini Penting?

**EKSPEKTASI YANG REALISTIS**
Spekulan mengharapkan profit setiap hari. Ketika tidak tercapai, mereka frustrasi dan membuat keputusan buruk. Pebisnis memahami bahwa bisnis apapun memiliki siklus.

**PENGELOLAAN RISIKO**
Pebisnis melihat risiko sebagai variabel yang harus dikelola. Setiap bisnis punya risiko—yang membedakan pengusaha sukses adalah kemampuan mengelola risiko tersebut.

**KEBERLANJUTAN**
Spekulan bisa profit besar hari ini, tapi bangkrut minggu depan. Pebisnis mungkin profit kecil, tapi bisnis bertahan bertahun-tahun dan terus bertumbuh.

## Analogi: Trading Sebagai Bisnis Restoran

Bayangkan Anda membuka restoran:

- **LOSS** = Biaya operasional (seperti listrik, sewa tempat)
- **PROFIT** = Pendapatan dari pelanggan
- **JURNAL** = Laporan keuangan bisnis
- **TRADING PLAN** = Business plan
- **RISK MANAGEMENT** = Asuransi dan cadangan modal

> "Saya adalah pebisnis pasar keuangan. Setiap keputusan saya didasarkan pada analisis dan rencana, bukan emosi. Loss adalah biaya operasional, profit adalah hasil dari proses yang benar."
      `,
      estimatedMinutes: 30,
      videoUrl: null,
      imageUrl: null
    },
    {
      id: 'module-1-lesson-2',
      order: 2,
      title: '1.2 Anatomi Emosi: Mengidentifikasi dan Mematikan Greed, Fear, & Hope',
      content: `
# 1.2 Anatomi Emosi: Greed, Fear, & Hope

## Pendahuluan
"Musuh terbesar trader bukan market, tapi cermin."

Dalam trading, ada tiga serigala yang selalu bersembunyi di dalam pikiran setiap trader: **Greed (Keserakahan)**, **Fear (Ketakutan)**, dan **Hope (Harapan Palsu)**.

Ketiganya adalah emosi alami manusia. Namun, di pasar keuangan, emosi ini adalah musuh yang harus dikenali dan dinetralkan.

## Serigala Pertama: GREED (Keserakahan)

**Definisi:**
Greed adalah keinginan berlebihan untuk mendapatkan profit lebih besar dari yang seharusnya, sehingga mengabaikan rencana awal.

**Gejala:**
- Menggeser TP lebih jauh padahal sudah dekat target
- Menambah lot size setelah beberapa kali profit
- Entry lagi meski sudah mencapai target harian
- Tidak mau cut profit di zona resistance kuat

**Bahaya:**
- Profit yang sudah di tangan hilang karena reversal
- Overtrading yang menghancurkan akun
- Loss besar akibat posisi terlalu besar

**Cara Mengatasi:**
1. Tetapkan target harian/mingguan yang realistis
2. Patuhi TP yang sudah ditentukan sejak awal
3. Jangan tambah posisi tanpa analisis ulang
4. Ingat: "Profit yang sudah di tangan lebih berharga dari profit yang masih di udara"

## Serigala Kedua: FEAR (Ketakutan)

**Definisi:**
Fear adalah ketakutan berlebihan yang menghambat eksekusi rencana atau membuat keputusan prematur.

**Gejala:**
- Ragu-ragu entry padahal setup sudah valid
- Cut loss terlalu cepat sebelum SL tersentuh
- Tidak berani entry setelah mengalami loss
- Takut loss sehingga tidak pasang SL

**Bahaya:**
- Kehilangan peluang profit yang valid
- Akumulasi missed opportunity yang menyakitkan
- Tidak konsisten dalam eksekusi

**Cara Mengatasi:**
1. Percayai analisis dan rencana Anda
2. Gunakan lot size kecil untuk mengurangi pressure
3. Ingat bahwa SL adalah proteksi, bukan musuh
4. Latihan dengan demo account untuk rebuild confidence

## Serigala Ketiga: HOPE (Harapan Palsu)

**Definisi:**
Hope adalah harapan irasional bahwa posisi loss akan berbalik tanpa dasar analisis yang jelas.

**Gejala:**
- Tidak mau cut loss karena "yakin akan balik"
- Averaging posisi loss tanpa plan
- Menghapus SL karena "yakin trend akan berbalik"
- Membiarkan floating loss membengkak

**Bahaya:**
- Margin call
- Loss yang seharusnya -1% menjadi -10% atau lebih
- Psychological trauma yang berkepanjangan

**Cara Mengatasi:**
1. Disiplin cut loss sesuai plan
2. Jangan pernah hapus atau geser SL menjauh
3. Accept the loss dan move on
4. Evaluasi: jika analisis salah, terima dan perbaiki

## Teknik Netralisasi Emosi

### Pre-Trade Ritual
- Tulis rencana lengkap sebelum market buka
- Tentukan zona entry, SL, dan TP
- Visualisasi skenario terburuk dan penerimaan

### During Trade
- Jangan pantau chart terus-menerus
- Set alarm untuk zona penting
- Fokus pada eksekusi, bukan hasil

### Post-Trade
- Catat di jurnal dengan jujur
- Evaluasi: apakah emosi mempengaruhi keputusan?
- Terima hasil, pelajari proses

> "Greed dan Fear adalah dua serigala dalam diri Anda. Yang menang adalah yang Anda beri makan."
      `,
      estimatedMinutes: 45,
      videoUrl: null,
      imageUrl: null
    },
    {
      id: 'module-1-lesson-3',
      order: 3,
      title: '1.3 Hukum Probabilitas: Mengapa "Salah" Tidak Berarti "Gagal"',
      content: `
# 1.3 Hukum Probabilitas: Mengapa "Salah" Tidak Berarti "Gagal"

## Pendahuluan
"Loss mengajarkan lebih banyak dari profit. Dengarkan pelajarannya."

Salah satu kesalahan terbesar pemula adalah menganggap setiap loss sebagai kegagalan. Padahal, dalam trading, **loss adalah bagian normal dari permainan probabilitas**.

## Memahami Probabilitas dalam Trading

Trading adalah **permainan angka dan probabilitas**, bukan permainan sempurna.

**Contoh Sederhana:**
Jika Anda punya sistem dengan win rate 60%, artinya:
- Dari 10 trade, Anda akan **WIN 6 kali** dan **LOSS 4 kali**
- Tetapi Anda **tidak tahu** trade mana yang akan win atau loss
- Yang penting adalah **konsistensi eksekusi**

## Losing Streak: Statistik yang Harus Dipahami

Dengan win rate 60%, berapa kemungkinan Anda loss **5 kali berturut-turut**?

**Jawaban:** Sekitar 1% (masih mungkin terjadi!)

Ini berarti bahkan dengan sistem yang bagus, losing streak adalah **normal dan statistik yang wajar**.

**Yang Harus Anda Lakukan:**
1. Terima bahwa losing streak adalah bagian dari probabilitas
2. Jangan panik dan ubah sistem setelah 3-5 loss beruntun
3. Tetap ikuti plan dengan disiplin
4. Fokus pada eksekusi, bukan hasil jangka pendek

## Matematika Profit: Win Rate vs RRR

**Apakah Win Rate 90% Selalu Lebih Baik?**

Tidak selalu! Yang penting adalah **expectancy** (ekspektasi profit).

**Contoh Kasus:**

| Sistem | Win Rate | RRR | Expectancy |
|--------|----------|-----|-----------|
| A | 90% | 1:0.5 | Loss jangka panjang |
| B | 40% | 1:3 | Profit jangka panjang |

**Penjelasan:**
- Sistem A: Win rate tinggi tapi RRR buruk (risk 100, profit 50)
- Sistem B: Win rate rendah tapi RRR excellent (risk 100, profit 300)

**Formula Expectancy:**

Expectancy = (Win Rate × Avg Win) - (Loss Rate × Avg Loss)

Sistem A: (0.9 × 50) - (0.1 × 100) = 45 - 10 = +35
Sistem B: (0.4 × 300) - (0.6 × 100) = 120 - 60 = +60

Sistem B lebih profitable meski win rate lebih rendah!

## Hukum Angka Besar (Law of Large Numbers)

Dalam trading, **hasil individu tidak penting**. Yang penting adalah **hasil agregat dalam sample size yang besar**.

**Analogi Casino:**
- Casino tidak menang setiap ronde
- Tapi dengan edge kecil (2-5%) dan volume besar, mereka selalu profit
- Trader profesional berpikir seperti casino: **fokus pada edge dan volume**

**Mindset Trader Profesional:**
- Tidak excited saat profit
- Tidak depresi saat loss
- Fokus: "Apakah saya mengikuti plan?"

> "Anda tidak gagal ketika loss. Anda gagal ketika menyerah."

## Key Takeaways

1. **Loss ≠ Kegagalan.** Loss adalah outcome probabilitas normal
2. **Win Rate tinggi ≠ Sukses.** Yang penting adalah expectancy
3. **Fokus pada proses**, bukan hasil per trade
4. **Sample size matters.** Evaluasi setelah minimal 30-50 trade
5. **Konsistensi > Kesempurnaan**
      `,
      estimatedMinutes: 30,
      videoUrl: null,
      imageUrl: null
    },
    {
      id: 'module-1-lesson-4',
      order: 4,
      title: '1.4 Disiplin Sebagai Mata Uang: Menghargai Proses di Atas Hasil',
      content: `
# 1.4 Disiplin Sebagai Mata Uang: Menghargai Proses di Atas Hasil

## Pendahuluan
"Disiplin adalah jembatan antara impian dan kenyataan."

Banyak trader punya strategi bagus, tapi hanya sedikit yang sukses. Mengapa? Karena **mereka tidak disiplin mengikuti strategi mereka sendiri**.

Disiplin adalah mata uang sebenarnya dalam trading. Bukan dolar, bukan lot size, tapi **kepatuhan pada rencana**.

## Mengapa Disiplin Begitu Sulit?

**Alasan Psikologis:**
1. **Instant Gratification Bias** - Otak manusia suka reward instan
2. **Recency Bias** - Hasil terakhir mempengaruhi keputusan berikutnya
3. **Confirmation Bias** - Mencari alasan untuk justify pelanggaran plan

**Contoh:**
- Plan: "Entry hanya di pivot support dengan konfirmasi candle"
- Realita: "Ah, kayaknya ini akan naik, entry aja dulu" ❌

## Redefining Sukses dalam Trading

**Trader Biasa:**
- Sukses = Profit hari ini
- Gagal = Loss hari ini

**Plan Warrior:**
- Sukses = Mengikuti plan dengan disiplin
- Gagal = Melanggar plan meski profit

**Mengapa Definisi Ini Penting?**

Karena Anda **mengontrol proses, tidak mengontrol hasil**.

**Yang Bisa Dikontrol:**
✅ Apakah saya analisis dengan benar?
✅ Apakah saya entry sesuai plan?
✅ Apakah saya hitung risiko dengan benar?
✅ Apakah saya cut loss sesuai SL?

**Yang Tidak Bisa Dikontrol:**
❌ Apakah trade ini profit atau loss?
❌ Apakah market bergerak sesuai analisis?
❌ Apakah target tercapai hari ini?

## Framework 4R: Membangun Habit Disiplin

### 1. REMINDER (Pengingat)
Buat pengingat visual untuk plan Anda:
- Sticky notes di monitor
- Wallpaper laptop dengan quote MPT
- Alarm reminder sebelum market buka

### 2. ROUTINE (Rutinitas)
Buat pre-trade ritual yang konsisten:
- 08:00 - Baca jurnal kemarin
- 08:15 - Analisis market H4, H1, M15
- 08:30 - Tulis plan harian
- 08:45 - Set alert untuk zona entry

### 3. REWARD (Penghargaan)
Beri reward untuk **disiplin**, bukan profit:
- 7 hari berturut-turut ikuti plan? Treat yourself!
- 30 trade konsisten sesuai plan? Celebration!

### 4. RECORD (Rekam)
Catat setiap hari di jurnal:
- Apakah saya disiplin hari ini? (Ya/Tidak)
- Apa yang membuat saya hampir melanggar plan?
- Apa yang akan saya improve besok?

## Daily Discipline Scorecard

**Template Harian:**

| No | Checklist | ✓ |
|----|-----------|---|
| 1 | Analisis pasar sebelum entry | □ |
| 2 | Entry hanya saat setup valid | □ |
| 3 | Lot size sesuai kalkulasi RPT 1% | □ |
| 4 | SL dipasang sejak awal | □ |
| 5 | TP sesuai RRR minimal 1:2 | □ |
| 6 | Tidak menggeser SL menjauh | □ |
| 7 | Tidak revenge trading | □ |
| 8 | Jurnal diisi lengkap | □ |

**Score Hari Ini:** __/8

**Interpretasi:**
- 8/8 = Excellent Discipline ⭐⭐⭐
- 6-7/8 = Good, need minor improvement ⭐⭐
- 4-5/8 = Warning zone ⚠️
- < 4/8 = Critical, review needed 🚨

## Quotes untuk Motivasi Harian

> "Profit adalah bonus. Disiplin adalah tujuan."

> "Trader disiplin tidur nyenyak. Trader emosional tidur dengan floating loss."

> "Konsistensi lahir dari disiplin. Profit lahir dari konsistensi."

## Key Takeaways

1. **Disiplin > Strategi.** Strategi biasa yang dieksekusi dengan disiplin mengalahkan strategi sempurna tanpa disiplin
2. **Fokus pada proses**, hasil akan mengikuti
3. **Sukses = Kepatuhan pada plan**, bukan profit harian
4. **Build habits**, bukan rely on motivation
5. **Track discipline**, bukan hanya track profit/loss
      `,
      estimatedMinutes: 30,
      videoUrl: null,
      imageUrl: null
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Module 2: The Shield - Risk Management
const MODULE_2_CONTENT = {
  id: 'module-2',
  moduleNumber: 2,
  title: 'THE SHIELD',
  subtitle: 'Risk Management & Capital Protection',
  description: 'Learn critical risk management techniques. Protect your capital with 1% RPT rule, position sizing, and drawdown management.',
  level: 'RECRUIT',
  order: 2,
  isAvailable: true,
  estimatedHours: 4,
  totalPoints: 175,
  prerequisites: ['module-1'],
  lessons: [
    {
      id: 'module-2-lesson-1',
      order: 1,
      title: '2.1 Aturan Emas RPT 1%: Matematika Pertahanan Akun',
      content: `
# 2.1 Aturan Emas RPT 1%: Matematika Pertahanan Akun

## Pendahuluan
"Perlindungan modal adalah prioritas utama." — Pilar Risk Management MPT

Aturan Emas MPT: **Risk Per Trade (RPT) maksimal 1% dari equity**.

Ini bukan sekedar angka. Ini adalah **sistem pertahanan** yang akan menyelamatkan akun Anda dari margin call.

## Mengapa 1%? Bukan 2%, 5%, atau 10%?

**Jawaban: Recovery Math (Matematika Pemulihan)**

Ketika Anda loss, **persentase yang dibutuhkan untuk recovery lebih besar** dari persentase loss.

| Loss | Sisa Modal | Gain Needed to Recover |
|------|-----------|----------------------|
| -10% | 90% | +11.11% |
| -20% | 80% | +25% |
| -30% | 70% | +42.86% |
| -50% | 50% | +100% |
| -75% | 25% | +300% |

**Kesimpulan:**
Semakin besar loss, semakin sulit recovery!

Dengan RPT 1%, Anda bisa loss **100 kali berturut-turut** baru MC (secara teori). Dengan RPT 10%, Anda cuma bisa loss **10 kali**.

## Formula Dasar Risk Per Trade

**Formula:**
Risk Amount = Equity × RPT%

**Contoh:**
- Equity = $10,000
- RPT = 1%
- Risk Amount = $10,000 × 1% = $100 per trade

Artinya, **maksimal loss yang boleh Anda terima per trade adalah $100**, tidak peduli berapa kali entry atau berapa lot yang digunakan.

## RPT Berdasarkan Level Trader

| Level Trader | Recommended RPT | Keterangan |
|-------------|----------------|------------|
| Beginner (< 6 bulan) | 0.5% - 1% | Masih belajar, prioritas survival |
| Intermediate (6-12 bulan) | 1% - 1.5% | Sudah punya track record konsisten |
| Advanced (> 1 tahun) | 1.5% - 2% | Proven system dengan expectancy positif |

**PENTING:** Jangan naikkan RPT sebelum punya **minimal 100 trade** dengan expectancy positif!

## Studi Kasus: Perbedaan RPT

**Trader A - RPT 10%**
- Modal: $10,000
- Risk per trade: $1,000
- 5 loss beruntun = -$5,000 (sisa $5,000)
- Butuh +100% untuk recovery

**Trader B - RPT 1%**
- Modal: $10,000
- Risk per trade: $100
- 5 loss beruntun = -$500 (sisa $9,500)
- Butuh +5.26% untuk recovery

**Siapa yang lebih survive? Trader B.**

> "Risk 1%, Sleep 100%."

## Action Items

1. **Hitung risk amount Anda sekarang:**
   - Equity: $_______
   - RPT 1%: $_______

2. **Commit:** "Saya tidak akan risk lebih dari $______ per trade"

3. **Set rule:** Jika melanggar RPT 1%, berhenti trading 24 jam untuk evaluasi
      `,
      estimatedMinutes: 30,
      videoUrl: null,
      imageUrl: null
    },
    {
      id: 'module-2-lesson-2',
      order: 2,
      title: '2.2 Manajemen Margin & Leverage: Kapasitas Kendaraan Trading',
      content: `
# 2.2 Manajemen Margin & Leverage: Kapasitas Kendaraan Trading

## Memahami Konsep Dasar

**Margin** = Jaminan yang harus Anda setorkan untuk membuka posisi
**Leverage** = Daya ungkit yang diberikan broker

**Analogi Sederhana:**
- Margin = DP mobil
- Leverage = Cicilan/kredit yang diberikan bank

## Leverage: Pedang Bermata Dua

Leverage **BUKAN** alat untuk profit lebih besar. Leverage adalah alat untuk **efisiensi modal**.

**Kesalahan Umum:**
"Wah, leverage 1:500! Berarti saya bisa profit 500x lebih cepat!" ❌

**Realita:**
Leverage tinggi = Risk tinggi JIKA tidak dikelola dengan benar.

## Rekomendasi Leverage MPT

| Equity | Recommended Leverage | Alasan |
|--------|---------------------|--------|
| < $1,000 | 1:100 - 1:200 | Cukup untuk flexibility, tidak terlalu bahaya |
| $1,000 - $5,000 | 1:100 - 1:300 | Sweet spot untuk trader retail |
| > $5,000 | 1:50 - 1:100 | Semakin besar modal, semakin kecil leverage yang dibutuhkan |

**Prinsip:** Semakin besar modal, semakin kecil leverage yang seharusnya digunakan.

## Margin vs Risk: Perbedaan Kritis

**MARGIN** ≠ **RISK**

**Contoh:**
- Equity: $10,000
- Margin used: $1,000 (10%)
- Risk (SL): $100 (1%)

**Penjelasan:**
- Margin 10% bukan berarti Anda risk 10%
- Risk sebenarnya ditentukan oleh **jarak SL**, bukan margin used

**Kesalahan Fatal:**
Banyak trader fokus pada margin level tapi lupa hitung actual risk!

> "Trader yang tidak menghormati risiko, akan dihormati oleh Margin Call."
      `,
      estimatedMinutes: 25,
      videoUrl: null,
      imageUrl: null
    },
    {
      id: 'module-2-lesson-3',
      order: 3,
      title: '2.3 Kalkulasi Lot Presisi: Formula MPT Berdasarkan Stop Loss',
      content: `
# 2.3 Kalkulasi Lot Presisi: Formula MPT Berdasarkan Stop Loss

## Formula Master Kalkulasi Lot

**Formula:**
Lot Size = (Equity × RPT%) / (SL Distance in Pips × Pip Value)

**Variabel:**
- **Equity:** Saldo akun Anda
- **RPT%:** Risk Per Trade (biasanya 1%)
- **SL Distance:** Jarak dari entry ke SL dalam pips
- **Pip Value:** Nilai per pip (tergantung pair dan lot size)

## Nilai Per Pip untuk Berbagai Instrumen

**Forex (Standard Lot = 100,000 units):**
- 1 Standard Lot = $10/pip (untuk pair XXX/USD)
- 0.1 Lot (Mini) = $1/pip
- 0.01 Lot (Micro) = $0.10/pip

**Gold (XAUUSD):**
- 1 Lot = $1/pip (approx)
- 0.1 Lot = $0.10/pip

## Contoh Kalkulasi Lengkap

**Setup Trading:**
- Pair: EUR/USD
- Equity: $10,000
- RPT: 1% = $100
- Entry: 1.0850
- SL: 1.0800
- SL Distance: 50 pips

**Kalkulasi:**

Lot Size = ($10,000 × 1%) / (50 pips × $10/pip)
         = $100 / $500
         = 0.20 Lot

**Validasi:**
- Jika SL tersentuh: 50 pips × 0.20 lot × $10 = $100 ✓
- Risk = 1% dari equity ✓

## Tabel Referensi Cepat

**Equity: $10,000 | RPT: 1% = $100**

| SL Distance | Lot Size (EUR/USD) | Max Loss if SL Hit |
|------------|-------------------|-------------------|
| 20 pips | 0.50 lot | $100 |
| 30 pips | 0.33 lot | $99 |
| 50 pips | 0.20 lot | $100 |
| 100 pips | 0.10 lot | $100 |

**Kesimpulan:** Semakin jauh SL, semakin kecil lot size yang harus digunakan.

## Tools Recommended

1. **MPT Calculator** (akan disediakan di platform)
2. **Spreadsheet Template** (download di resources)
3. **MT4/MT5 Calculator Script**

> "Kalkulasi lot yang presisi adalah bentuk penghormatan kepada modal Anda."
      `,
      estimatedMinutes: 40,
      videoUrl: null,
      imageUrl: null
    },
    {
      id: 'module-2-lesson-4',
      order: 4,
      title: '2.4 Risk to Reward Ratio: Rahasia Profit dengan Akurasi Rendah',
      content: `
# 2.4 Risk to Reward Ratio: Rahasia Profit dengan Akurasi Rendah

## Memahami RRR

**Risk to Reward Ratio (RRR)** adalah perbandingan antara risiko yang Anda ambil dengan target profit yang Anda inginkan.

**Formula:**

RRR = Target Profit / Risk

**Contoh:**
- Risk (SL): $100
- Target (TP): $200
- RRR = $200 / $100 = 1:2

## Standar RRR MPT

**Minimum RRR:** 1:2
**Recommended RRR:** 1:3 atau lebih

**Alasan:**
Dengan RRR 1:2, Anda cukup **win 34%** untuk break even!
Dengan RRR 1:3, Anda cukup **win 26%** untuk break even!

## Break-Even Win Rate

**Formula:**

Break-Even Win Rate = 1 / (1 + RRR)

**Tabel:**

| RRR | Break-Even Win Rate |
|-----|-------------------|
| 1:1 | 50% |
| 1:2 | 33.3% |
| 1:3 | 25% |
| 1:5 | 16.7% |

**Insight:**
Dengan RRR 1:3, bahkan jika Anda hanya win 40% dari trade, Anda masih **profit secara keseluruhan**!

## Cara Menentukan Take Profit Berdasarkan RRR

**Step-by-step:**

1. Tentukan SL berdasarkan level teknikal (support/resistance)
2. Hitung distance SL dalam pips
3. Kalikan dengan RRR untuk dapat TP distance

**Contoh:**
- Entry: 1.0850
- SL: 1.0800 (50 pips)
- RRR target: 1:2
- TP distance: 50 × 2 = 100 pips
- TP level: 1.0950

## Studi Kasus: Power of RRR

**Trader A - RRR 1:1 | Win Rate 60%**
10 trades:
- 6 win × $100 = +$600
- 4 loss × $100 = -$400
- **Net Profit: +$200**

**Trader B - RRR 1:3 | Win Rate 40%**
10 trades:
- 4 win × $300 = +$1,200
- 6 loss × $100 = -$600
- **Net Profit: +$600**

**Kesimpulan:** Trader B dengan win rate lebih rendah tapi RRR lebih baik **profit 3x lebih besar**!

> "Pertanyaan pertama bukan 'berapa profit-nya?' tapi 'berapa risikonya?'"
      `,
      estimatedMinutes: 35,
      videoUrl: null,
      imageUrl: null
    },
    {
      id: 'module-2-lesson-5',
      order: 5,
      title: '2.5 Drawdown Management: Mengelola Penurunan Saldo',
      content: `
# 2.5 Drawdown Management: Mengelola Penurunan Saldo

## Memahami Drawdown

**Drawdown** = Penurunan equity dari peak (titik tertinggi) ke valley (titik terendah).

**Formula:**

Drawdown % = [(Peak - Valley) / Peak] × 100%

**Contoh:**
- Peak equity: $10,000
- Current equity: $8,500
- Drawdown: [($10,000 - $8,500) / $10,000] × 100% = 15%

## Batas Drawdown MPT

| Level | Drawdown | Status | Tindakan |
|-------|----------|--------|----------|
| Safe | 0% - 5% | Normal fluktuasi | Trading as usual |
| Warning | 5% - 10% | Perlu perhatian | Review strategy |
| Danger | 10% - 15% | Critical zone | Reduce lot size 50% |
| Critical | 15% - 20% | Emergency | STOP trading, full review |
| Margin Call Zone | > 20% | Catastrophic | Account recovery mode |

**Aturan Emas:** Jika drawdown mencapai 15%, **STOP trading** dan lakukan evaluasi penuh.

## Protokol Tindakan Berdasarkan Level Drawdown

### Level 1: Safe Zone (0-5%)
✅ Continue normal trading
✅ Monitor closely
✅ Review jurnal mingguan

### Level 2: Warning (5-10%)
⚠️ Review last 10 trades
⚠️ Check if following plan
⚠️ Consider taking 1-2 days break

### Level 3: Danger (10-15%)
🚨 Reduce lot size to 50%
🚨 Only take A+ setups
🚨 Daily review mandatory

### Level 4: Critical (15-20%)
🛑 STOP all trading
🛑 Full strategy review
🛑 Consult with mentor/coach
🛑 Consider demo account reset

## Psikologi Drawdown

**Yang TIDAK Boleh Dilakukan:**
❌ Revenge trading untuk cepat balik modal
❌ Naikkan lot size untuk "catch up"
❌ Abandon plan dan coba strategi baru
❌ Deposit lebih banyak tanpa fix masalah

**Yang HARUS Dilakukan:**
✅ Accept the drawdown
✅ Review jurnal untuk cari pola kesalahan
✅ Kembali ke basic: disiplin dan plan
✅ Reduce pressure dengan lot size lebih kecil

## Teknik Mengelola Emosi Saat Drawdown

1. **Acceptance:** Terima bahwa drawdown adalah normal
2. **Detachment:** Jangan attach identitas Anda dengan equity
3. **Process Focus:** Fokus pada perbaikan proses, bukan hasil
4. **Patience:** Recovery butuh waktu, jangan terburu-buru

## Recovery Strategy

**Step-by-step:**

1. **Stop & Reflect** (1-3 hari no trading)
2. **Analyze Mistakes** (review 20 trade terakhir)
3. **Fix the Leak** (identifikasi pola kesalahan)
4. **Small Size Comeback** (mulai dengan 0.5% RPT)
5. **Prove Consistency** (min 10 trade disiplin)
6. **Gradual Increase** (kembali ke 1% RPT)

> "Jatuh itu biasa. Bangkit dengan rencana yang lebih baik itu luar biasa."

## Key Takeaways

1. **Drawdown adalah normal**, tapi harus dikelola
2. **Set hard limits:** 15% = STOP
3. **Jangan revenge trade** saat drawdown
4. **Recovery dimulai dari disiplin**, bukan dari lot besar
5. **Patience is key** dalam recovery
      `,
      estimatedMinutes: 45,
      videoUrl: null,
      imageUrl: null
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Module 3: The Map - Technical Analysis
const MODULE_3_CONTENT = {
  id: 'module-3',
  moduleNumber: 3,
  title: 'THE MAP',
  subtitle: 'Technical Analysis Fundamentals',
  description: 'Navigate markets with technical analysis. Master market structure, support/resistance, and multi-timeframe analysis.',
  level: 'WARRIOR',
  order: 3,
  isAvailable: true,
  estimatedHours: 5,
  totalPoints: 215,
  prerequisites: ['module-1', 'module-2'],
  lessons: [
    {
      id: 'module-3-lesson-1',
      order: 1,
      title: '3.1 Market Structure: Identifikasi Trend',
      content: `
# 3.1 Market Structure: Identifikasi Trend

## Pendahuluan
"The trend is your friend until the end." - Market Wisdom

Memahami struktur pasar adalah fondasi dari analisis teknikal. Tanpa bisa membaca struktur, Anda seperti navigator tanpa kompas.

## Tiga Kondisi Market

Market hanya memiliki **3 kondisi**:

1. **Uptrend (Bullish Market)** - Harga cenderung naik
2. **Downtrend (Bearish Market)** - Harga cenderung turun
3. **Sideways (Ranging Market)** - Harga bergerak dalam range

## Uptrend (Bullish Market)

**Karakteristik:**
- Higher High (HH) dan Higher Low (HL)
- Setiap peak lebih tinggi dari peak sebelumnya
- Setiap valley lebih tinggi dari valley sebelumnya

**Strategi:**
- Buy di area support/pullback
- Hindari sell counter-trend
- Follow the momentum

## Downtrend (Bearish Market)

**Karakteristik:**
- Lower High (LH) dan Lower Low (LL)
- Setiap peak lebih rendah dari peak sebelumnya
- Setiap valley lebih rendah dari valley sebelumnya

**Strategi:**
- Sell di area resistance/pullback
- Hindari buy counter-trend
- Follow the momentum

## Sideways (Ranging Market)

**Karakteristik:**
- Harga bounce antara support dan resistance
- Tidak ada clear direction
- Equal high dan equal low

**Strategi:**
- Buy di support, Sell di resistance
- Tight SL karena bisa breakout kapan saja
- Best strategy: tunggu breakout

## Swing High dan Swing Low

**Swing High:** Puncak yang dikelilingi oleh 2 candle lebih rendah di kiri dan kanan
**Swing Low:** Lembah yang dikelilingi oleh 2 candle lebih tinggi di kiri dan kanan

## Break of Structure (BOS)

**Definisi:** Penembusan swing high terakhir (dalam uptrend) atau swing low terakhir (dalam downtrend)

**Signifikansi:** Konfirmasi bahwa trend masih berlanjut

## Change of Character (CHoCH)

**Definisi:** Kegagalan membuat HH baru (uptrend) atau LL baru (downtrend)

**Signifikansi:** Tanda awal bahwa trend mungkin berubah

> "Trend adalah sahabat Anda sampai akhir - tapi Anda harus tahu kapan akhirnya."
      `,
      estimatedMinutes: 40,
      videoUrl: null,
      imageUrl: null
    },
    {
      id: 'module-3-lesson-2',
      order: 2,
      title: '3.2 Level Psikologis Pasar: Pivot Point sebagai Pusat Gravitasi',
      content: `
# 3.2 Level Psikologis Pasar: Pivot Point sebagai Pusat Gravitasi

## Apa itu Pivot Point?

**Pivot Point** adalah level harga yang dihitung dari High, Low, dan Close hari sebelumnya. Level ini menjadi acuan banyak trader institutional.

**Analogi:** Pivot adalah "pusat gravitasi" pasar. Harga cenderung berputar di sekitar level ini.

## Formula Pivot Point Klasik

\`\`\`
Pivot (P) = (High + Low + Close) / 3

Resistance 1 (R1) = (2 × P) - Low
Resistance 2 (R2) = P + (High - Low)
Resistance 3 (R3) = High + 2 × (P - Low)

Support 1 (S1) = (2 × P) - High
Support 2 (S2) = P - (High - Low)
Support 3 (S3) = Low - 2 × (High - P)
\`\`\`

## Cara Menggunakan Pivot Point

### Scenario 1: Harga di Atas Pivot
- **Bias:** Bullish
- **Strategy:** Look for buy opportunities
- **Target:** R1, R2, R3

### Scenario 2: Harga di Bawah Pivot
- **Bias:** Bearish
- **Strategy:** Look for sell opportunities
- **Target:** S1, S2, S3

### Scenario 3: Harga di Sekitar Pivot
- **Bias:** Neutral (wait and see)
- **Strategy:** Wait for breakout atau rejection

## Strategi Trading dengan Pivot Point

**Setup 1: Bounce dari Pivot**
- Entry: Saat harga reject dari pivot dengan konfirmasi candle
- SL: 10-20 pips di luar pivot
- TP: R1 (jika bullish) atau S1 (jika bearish)

**Setup 2: Breakout Pivot**
- Entry: Saat harga break pivot dengan volume
- SL: Di sisi lain pivot
- TP: R1/S1 atau lebih

## Central Pivot Range (CPR)

**Formula:**
\`\`\`
TC (Top Central) = (Pivot - BC) + Pivot
BC (Bottom Central) = (High + Low) / 2
\`\`\`

**Interpretasi:**
- CPR sempit = High volatility expected
- CPR lebar = Low volatility expected

> "Pivot Point adalah level psikologis dimana banyak trader membuat keputusan."
      `,
      estimatedMinutes: 50,
      videoUrl: null,
      imageUrl: null
    },
    {
      id: 'module-3-lesson-3',
      order: 3,
      title: '3.3 Dinamika Support & Resistance: Zona Demand dan Supply',
      content: `
# 3.3 Dinamika Support & Resistance: Zona Demand dan Supply

## Definisi Support dan Resistance

**Support:** Level dimana demand (pembeli) cukup kuat untuk menghentikan penurunan harga
**Resistance:** Level dimana supply (penjual) cukup kuat untuk menghentikan kenaikan harga

**Analogi:**
- Support = Lantai yang menahan harga jatuh
- Resistance = Langit-langit yang menghalangi harga naik

## Mengapa S/R Bekerja?

**Psikologi Market:**
1. **Regret:** Trader yang miss opportunity di level tertentu ingin entry di level yang sama
2. **Pain:** Trader yang trapped ingin exit saat harga kembali ke entry mereka
3. **Profit Taking:** Trader yang profit ingin take profit di level tertentu

## Jenis-Jenis Support/Resistance

### 1. **Horizontal S/R**
- Level harga yang ditest berkali-kali
- Paling mudah diidentifikasi
- Paling kuat

### 2. **Trendline S/R**
- Garis diagonal yang menghubungkan swing high/low
- Valid jika tersentuh minimal 3 kali
- Bisa berubah jadi support/resistance saat dibreak

### 3. **Moving Average S/R**
- MA50, MA100, MA200 sering jadi dynamic S/R
- Berguna di trending market

### 4. **Psychological Levels**
- Round numbers: 1.0000, 1.1000, 1.2000
- Fibonacci levels: 38.2%, 50%, 61.8%

## Cara Menentukan Level S/R yang Valid

**Kriteria Valid S/R:**
1. ✅ Tersentuh minimal **2-3 kali** dalam timeframe signifikan
2. ✅ Ada **reaksi jelas** (rejection atau bounce) saat tersentuh
3. ✅ **Aligned** dengan struktur market yang lebih besar
4. ✅ Area yang **jelas**, bukan line tipis

**Tips:**
- Gunakan **zona**, bukan line eksak
- Lebih besar timeframe, lebih kuat S/R
- Volume spike di S/R = konfirmasi kuat

## Support Become Resistance (SBR) / Resistance Become Support (RBS)

**Konsep Kunci:**
Saat support dibreak, level tersebut berubah jadi resistance (dan sebaliknya)

**Mengapa?**
- Trader yang buy di support kena SL → area painful → mereka akan sell jika harga kembali (resistance)
- Trader yang sell saat breakdown → jika harga naik lagi, mereka akan cut loss (resistance)

## Supply dan Demand Zone

**Demand Zone:** Area dimana buying pressure sangat kuat (strong support)
**Supply Zone:** Area dimana selling pressure sangat kuat (strong resistance)

**Karakteristik Valid Zone:**
1. Sharp move away dari zone
2. Fresh zone (belum di-retest)
3. Clear rejection wick
4. Volume spike

**Strategy:**
- Entry saat harga kembali ke zone
- SL di luar zone
- TP di zone lawan atau structure berikutnya

> "Support dan Resistance adalah jejak psikologi kolektif market."
      `,
      estimatedMinutes: 60,
      videoUrl: null,
      imageUrl: null
    },
    {
      id: 'module-3-lesson-4',
      order: 4,
      title: '3.4 Teknik Kunci Atas & Kunci Bawah: Filter Momentum Sesi',
      content: `
# 3.4 Teknik Kunci Atas & Kunci Bawah: Filter Momentum Sesi

## Memahami Sesi Trading Global

**3 Sesi Utama:**
1. **Asian Session** (Tokyo): 06:00 - 15:00 WIB
2. **European Session** (London): 14:00 - 23:00 WIB
3. **American Session** (New York): 19:00 - 04:00 WIB

**Overlap:**
- **London-NY Overlap** (19:00 - 23:00 WIB): Highest volume & volatility

## Konsep Kunci Atas & Kunci Bawah

**Kunci Atas (High Lock):**
High tertinggi yang dibentuk di **akhir sesi** tertentu (biasanya Asian session)

**Kunci Bawah (Low Lock):**
Low terendah yang dibentuk di **akhir sesi** tertentu

**Filosofi:**
Level ini menjadi "kunci" yang jika dibreak, mengindikasikan momentum kuat untuk melanjutkan trend.

## Strategi Trading dengan Kunci

### Setup 1: Breakout Kunci Atas (Bullish)
**Kondisi:**
- Asian session membentuk range
- High terakhir Asian = Kunci Atas
- London session break Kunci Atas

**Entry:**
- Saat candle close di atas Kunci Atas
- Konfirmasi: candle bullish dengan body besar

**SL:**
- Di bawah Kunci Bawah atau pivot terdekat

**TP:**
- Resistance terdekat atau 1:2 RRR

### Setup 2: Breakdown Kunci Bawah (Bearish)
**Kondisi:**
- Asian session membentuk range
- Low terakhir Asian = Kunci Bawah
- London session break Kunci Bawah

**Entry:**
- Saat candle close di bawah Kunci Bawah
- Konfirmasi: candle bearish dengan body besar

**SL:**
- Di atas Kunci Atas atau pivot terdekat

**TP:**
- Support terdekat atau 1:2 RRR

## Filter Tambahan untuk Validasi Breakout

**Konfirmasi Kuat:**
1. ✅ **Volume spike** saat breakout
2. ✅ **Candle close** di luar kunci (bukan hanya wick)
3. ✅ **No immediate pullback** (momentum kuat)
4. ✅ **Aligned dengan trend** timeframe lebih besar

**Red Flags (Hindari Entry):**
1. ❌ Breakout dengan wick panjang (rejection)
2. ❌ Low volume (weak breakout)
3. ❌ Immediate pullback masuk range lagi (false break)
4. ❌ Counter-trend di H4/H1

## Waktu Optimal untuk Strategy Ini

**Best Time:**
- **07:00 - 08:00 WIB:** Identifikasi kunci Asian
- **14:00 - 16:00 WIB:** Monitor London open untuk breakout
- **19:00 - 21:00 WIB:** NY session continuation

**Avoid:**
- Friday sore (low liquidity)
- Major news release (unpredictable spike)

> "Kunci Atas dan Bawah adalah penanda dimana institusi mulai bergerak."
      `,
      estimatedMinutes: 45,
      videoUrl: null,
      imageUrl: null
    },
    {
      id: 'module-3-lesson-5',
      order: 5,
      title: '3.5 Analisis Multi-Timeframe: Menyelaraskan H4, H1, dan M15',
      content: `
# 3.5 Analisis Multi-Timeframe: Menyelaraskan H4, H1, dan M15

## Prinsip Dasar Multi-Timeframe Analysis (MTA)

**Konsep:**
Menganalisis struktur market dari berbagai timeframe untuk mendapat **gambaran lengkap** dan **confluence** yang kuat.

**Analogi:**
- H4 = Melihat peta kota (big picture)
- H1 = Melihat peta jalan (medium view)
- M15 = Melihat detail persimpangan (precision entry)

## Fungsi Setiap Timeframe

### H4 (Higher Timeframe)
**Fungsi:** Menentukan **BIAS** (trend direction)

**Yang Dicari:**
- Trend: Uptrend, Downtrend, atau Sideways?
- Major S/R levels
- Market structure (HH, HL, LH, LL)

**Keputusan:**
- H4 uptrend → Bias BULLISH → Cari BUY only
- H4 downtrend → Bias BEARISH → Cari SELL only
- H4 sideways → Wait for breakout atau trade range

### H1 (Medium Timeframe)
**Fungsi:** Menentukan **ZONA ENTRY**

**Yang Dicari:**
- Pullback/retracement area
- Fresh demand/supply zone
- Confluence dengan H4 S/R

**Keputusan:**
- Tentukan area entry yang optimal
- Set alert untuk monitoring

### M15 (Lower Timeframe)
**Fungsi:** Menentukan **TRIGGER ENTRY** yang presisi

**Yang Dicari:**
- Candle pattern confirmation (pin bar, engulfing)
- Break of structure
- Rejection dari zona

**Keputusan:**
- Entry saat konfirmasi terpenuhi
- Tentukan SL dan TP eksak

## Aturan Alignment MPT

**RULE #1: Never Fight the H4 Trend**
Jika H4 uptrend, **JANGAN** ambil sell setup di H1/M15 (kecuali untuk scalping counter-trend dengan tight SL)

**RULE #2: Wait for Confluence**
Entry hanya saat **minimal 2 dari 3** timeframe aligned:
- H4 bullish + H1 pullback to support + M15 bullish confirmation ✅
- H4 bullish + H1 bearish + M15 bearish ❌ (not aligned)

**RULE #3: Higher Timeframe = Higher Priority**
Jika konflik, prioritaskan timeframe yang lebih besar

## Step-by-Step MTA Process

**Step 1: Analisis H4 (5 menit)**
1. Identifikasi trend
2. Mark major S/R
3. Tentukan bias

**Step 2: Analisis H1 (5 menit)**
1. Cari pullback area (jika H4 trending)
2. Mark demand/supply zone
3. Set alert di zona penting

**Step 3: Wait for M15 Confirmation**
1. Monitor saat harga di zona entry
2. Tunggu konfirmasi candle
3. Execute jika semua aligned

**Step 4: Manage Trade**
1. Entry dengan lot sesuai RPT 1%
2. SL di luar zona M15
3. TP minimal 1:2 RRR

## Contoh Praktis: EUR/USD

**H4 Analysis:**
- Trend: Uptrend (HH, HL formation)
- Current: Pullback to 1.0850 (previous resistance become support)
- Bias: **BULLISH** (look for BUY only)

**H1 Analysis:**
- Demand zone: 1.0840 - 1.0860
- Fresh zone with strong rejection wick
- Confluence dengan H4 support

**M15 Analysis:**
- Harga masuk demand zone
- Terbentuk bullish pin bar di 1.0850
- **TRIGGER: BUY**

**Trade Setup:**
- Entry: 1.0855
- SL: 1.0830 (25 pips, di bawah zone)
- TP: 1.0905 (50 pips, 1:2 RRR)
- Lot: Sesuai RPT 1%

> "Alignment adalah kunci. Trade bukan soal seberapa sering, tapi seberapa valid setupnya."

## Key Takeaways

1. **H4 = Bias**, H1 = Zone, M15 = Trigger
2. **Never fight** higher timeframe trend
3. **Wait for alignment** across timeframes
4. **Patience pays:** Better setup = Better probability
5. **Quality over quantity:** 1 aligned setup > 10 random entries
      `,
      estimatedMinutes: 60,
      videoUrl: null,
      imageUrl: null
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

async function populateModules() {
  console.log('🚀 Starting Academy Module Population...\n');

  const database = client.database(databaseId);
  const container = database.container(containerId);

  const modules = [MODULE_1_CONTENT, MODULE_2_CONTENT, MODULE_3_CONTENT];
  let successCount = 0;

  for (const module of modules) {
    try {
      console.log(`📚 Populating ${module.title}...`);
      
      // Upsert module (create or replace)
      await container.items.upsert(module);
      
      successCount++;
      console.log(`✅ ${module.title} - ${module.lessons.length} lessons populated`);
      console.log(`   Total Points: ${module.totalPoints} | Est. Hours: ${module.estimatedHours}`);
      console.log('');
    } catch (error: any) {
      console.error(`❌ Error populating ${module.title}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Population Complete!`);
  console.log(`📊 Summary:`);
  console.log(`   - Modules Created: ${successCount}/3`);
  console.log(`   - Total Lessons: ${modules.reduce((sum, m) => sum + m.lessons.length, 0)}`);
  console.log(`   - Total Points: ${modules.reduce((sum, m) => sum + m.totalPoints, 0)}`);
  console.log(`   - Total Hours: ${modules.reduce((sum, m) => sum + m.estimatedHours, 0)}`);
  console.log('='.repeat(60));
  console.log('\n🎓 Academy modules are ready for The Plan Warriors!\n');
}

populateModules().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
