/**
 * Initialize Quiz Containers for MPT Academy
 * Run: npx ts-node scripts/init-quiz-containers.ts
 */

import { CosmosClient } from '@azure/cosmos';

const endpoint = process.env.COSMOS_ENDPOINT!;
const key = process.env.COSMOS_KEY!;
const databaseId = 'mpt-warrior';

const client = new CosmosClient({ endpoint, key });

async function initQuizContainers() {
  console.log('🚀 Initializing Quiz Containers...\n');

  try {
    const { database } = await client.databases.createIfNotExists({
      id: databaseId,
    });
    console.log(`✅ Database: ${databaseId}`);

    // Container: quiz-questions
    console.log('\n📝 Creating quiz-questions container...');
    const { container: questionsContainer } = await database.containers.createIfNotExists({
      id: 'quiz-questions',
      partitionKey: {
        paths: ['/moduleId'], // Partition by moduleId
      },
    });

    console.log('✅ Container: quiz-questions');
    console.log('   Partition Key: /moduleId');
    console.log('   Purpose: Store quiz questions per module');

    // Container: quiz-answers
    console.log('\n✍️ Creating quiz-answers container...');
    const { container: answersContainer } = await database.containers.createIfNotExists({
      id: 'quiz-answers',
      partitionKey: {
        paths: ['/userId'], // Partition by userId
      },
    });

    console.log('✅ Container: quiz-answers');
    console.log('   Partition Key: /userId');
    console.log('   Purpose: Store user quiz answers and scores');

    // Insert Sample Questions for Modul 1
    console.log('\n📚 Inserting sample quiz questions for Modul 1...');

    const module1Questions = [
      {
        id: 'q-m1-001',
        moduleId: 'module-001',
        type: 'multiple-choice',
        question: 'Apa perbedaan utama antara mindset spekulan dan mindset pebisnis dalam trading?',
        options: [
          'Spekulan mencari kaya cepat, pebisnis mencari kaya konsisten dalam jangka panjang',
          'Spekulan menggunakan analisis, pebisnis menggunakan feeling',
          'Spekulan lebih berani, pebisnis lebih takut',
          'Spekulan trading full time, pebisnis trading part time'
        ],
        correctAnswer: 0, // Index of correct option
        points: 10,
        order: 1,
      },
      {
        id: 'q-m1-002',
        moduleId: 'module-001',
        type: 'multiple-choice',
        question: 'Menurut filosofi MPT, apa yang harus menjadi prioritas utama trader?',
        options: [
          'Profit maksimal setiap hari',
          'Perlindungan modal dan bertahan di market jangka panjang',
          'Memperbanyak jumlah trade',
          'Menggunakan leverage setinggi mungkin'
        ],
        correctAnswer: 1,
        points: 10,
        order: 2,
      },
      {
        id: 'q-m1-003',
        moduleId: 'module-001',
        type: 'multiple-choice',
        question: 'Apa yang dimaksud dengan "Greed" dalam trading?',
        options: [
          'Ketakutan untuk mengambil risiko',
          'Harapan bahwa posisi loss akan berbalik profit',
          'Keinginan berlebihan untuk profit lebih meskipun target sudah tercapai',
          'Disiplin dalam mengikuti rencana'
        ],
        correctAnswer: 2,
        points: 10,
        order: 3,
      },
      {
        id: 'q-m1-004',
        moduleId: 'module-001',
        type: 'true-false',
        question: 'Loss dalam trading adalah kegagalan fatal dan harus dihindari dengan cara apapun.',
        options: ['Benar', 'Salah'],
        correctAnswer: 1, // Salah
        points: 10,
        order: 4,
      },
      {
        id: 'q-m1-005',
        moduleId: 'module-001',
        type: 'essay',
        question: 'Jelaskan dengan kata-kata Anda sendiri mengapa disiplin lebih penting dari profit dalam trading. Berikan minimal 2 alasan.',
        correctAnswer: null, // Manual grading
        points: 20,
        order: 5,
      },
      {
        id: 'q-m1-006',
        moduleId: 'module-001',
        type: 'multiple-choice',
        question: 'Apa yang harus dilakukan ketika mengalami 3 kali loss berturut-turut?',
        options: [
          'Langsung revenge trading dengan lot lebih besar',
          'Istirahat minimal 2 jam dan evaluasi',
          'Ganti strategi sepenuhnya',
          'Terus trading untuk recovery'
        ],
        correctAnswer: 1,
        points: 10,
        order: 6,
      },
      {
        id: 'q-m1-007',
        moduleId: 'module-001',
        type: 'essay',
        question: 'Berdasarkan self-assessment profil emosi, identifikasi mana dari ketiga serigala (Greed, Fear, Hope) yang paling dominan dalam trading Anda. Jelaskan mengapa dan bagaimana Anda akan mengatasinya.',
        correctAnswer: null, // Manual grading
        points: 30,
        order: 7,
      },
    ];

    for (const question of module1Questions) {
      await questionsContainer.items.upsert(question);
      console.log(`   ✅ Question: ${question.id}`);
    }

    console.log('\n🎉 Quiz containers initialized successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Containers created: 2 (quiz-questions, quiz-answers)`);
    console.log(`   - Sample questions for Module 1: ${module1Questions.length}`);
    console.log(`   - Total Points: ${module1Questions.reduce((sum, q) => sum + q.points, 0)}`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

initQuizContainers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
