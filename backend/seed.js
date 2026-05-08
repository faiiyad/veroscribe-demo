require('dotenv').config();
const mongoose = require('mongoose');
const Physician = require('./models/Physician');

const PHYSICIANS = [
  {
    name: 'Dr. Sarah Chen',
    specialty: 'Cardiology',
    bio: 'Board-certified cardiologist with 15 years of experience in preventive cardiology and heart failure management. Trained at Johns Hopkins and passionate about patient education.',
    initials: 'SC',
    avatarColor: '#1A3C5E',
    workDays: [1, 2, 3, 4, 5],
    workTimes: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30'],
  },
  {
    name: 'Dr. James Okafor',
    specialty: 'General Practice',
    bio: 'Family medicine physician dedicated to comprehensive primary care for patients of all ages. Special interest in chronic disease management, preventive care, and mental wellness.',
    initials: 'JO',
    avatarColor: '#2E8B7A',
    workDays: [1, 2, 3, 4, 5],
    workTimes: ['08:30', '09:00', '09:30', '10:00', '11:00', '11:30', '14:00', '15:00', '15:30', '16:00'],
  },
  {
    name: 'Dr. Priya Patel',
    specialty: 'Neurology',
    bio: 'Neurologist specialising in headache disorders, epilepsy, and multiple sclerosis. Published researcher with a focus on improving quality of life for patients with chronic neurological conditions.',
    initials: 'PP',
    avatarColor: '#6B3FA0',
    workDays: [1, 3, 5], // Mon, Wed, Fri only
    workTimes: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  },
  {
    name: 'Dr. Michael Torres',
    specialty: 'Orthopaedic Surgery',
    bio: 'Orthopaedic surgeon specialising in sports injuries, joint replacement, and minimally invasive procedures. Former team physician for collegiate athletics with over 2,000 surgeries performed.',
    initials: 'MT',
    avatarColor: '#B45309',
    workDays: [2, 4], // Tue, Thu only
    workTimes: ['09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00'],
  },
];

async function run() {
  try {
    // Clear existing data
    await Physician.deleteMany({});
    const inserted = await Physician.insertMany(PHYSICIANS);
    console.log(`✅  Seeded ${inserted.length} physicians`);
    return inserted;
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    throw err;
  }
}

// Allow running directly: node seed.js
if (require.main === module) {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }
  mongoose
    .connect(MONGODB_URI)
    .then(run)
    .then(() => {
      console.log('Done.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { run };
