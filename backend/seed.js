import 'dotenv/config';
import mongoose from 'mongoose';
import Physician from './models/Physician.js';
import physicianInfo from './database/physician.json';

const PHYSICIANS = physicianInfo;

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

import { pathToFileURL } from 'url';

// Allow running directly: node seed.js
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
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

export { run };
