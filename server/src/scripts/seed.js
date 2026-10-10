const mongoose = require('mongoose');
const config = require('../config/env');
const User = require('../models/User');
const Project = require('../models/Project');
const Audit = require('../models/Audit');

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(config.mongodb.uri);
  console.log('Connected.');

  // Find or create demo user
  let user = await User.findOne({ email: 'demo@rankpilot.in' });
  if (!user) {
    user = await User.create({
      name: 'Anshul Mangla',
      email: 'demo@rankpilot.in',
      passwordHash: 'demo123456', // will be hashed by pre-save hook
      role: 'admin',
      plan: 'pro',
    });
    console.log('Demo user created: demo@rankpilot.in / demo123456');
  } else {
    console.log('Demo user already exists.');
  }

  // 5 Indian case-study websites
  const sampleProjects = [
    {
      name: 'IndiaMART B2B Marketplace',
      domain: 'indiamart.com',
      country: 'IN',
      language: 'en',
      keywords: ['b2b marketplace india', 'wholesale suppliers delhi', 'industrial manufacturers'],
      lastScore: 84,
      issueCount: 5,
      lastAnalyzedAt: new Date(Date.now() - 3600000 * 4),
    },
    {
      name: 'Nykaa Beauty & Cosmetics',
      domain: 'nykaa.com',
      country: 'IN',
      language: 'en',
      keywords: ['buy cosmetics online india', 'skincare routine products', 'luxury lipstick online'],
      lastScore: 88,
      issueCount: 3,
      lastAnalyzedAt: new Date(Date.now() - 3600000 * 12),
    },
    {
      name: 'CarWale Automotive Portal',
      domain: 'carwale.com',
      country: 'IN',
      language: 'en',
      keywords: ['new cars in india', 'best mileage cars 2026', 'used car valuation mumbai'],
      lastScore: 81,
      issueCount: 6,
      lastAnalyzedAt: new Date(Date.now() - 3600000 * 24),
    },
    {
      name: 'Practo Health & Doctors',
      domain: 'practo.com',
      country: 'IN',
      language: 'en',
      keywords: ['book doctor appointment bangalore', 'online consultation india', 'dermatologist near me'],
      lastScore: 86,
      issueCount: 4,
      lastAnalyzedAt: new Date(Date.now() - 3600000 * 48),
    },
    {
      name: 'Zerodha Broking Fintech',
      domain: 'zerodha.com',
      country: 'IN',
      language: 'en',
      keywords: ['demat account opening india', 'online stock trading broker', 'mutual funds direct zerodha'],
      lastScore: 92,
      issueCount: 2,
      lastAnalyzedAt: new Date(Date.now() - 3600000 * 72),
    },
  ];

  for (const p of sampleProjects) {
    const existing = await Project.findOne({ userId: user._id, domain: p.domain });
    if (!existing) {
      await Project.create({
        ...p,
        userId: user._id,
      });
      console.log(`Created project: ${p.domain}`);
    } else {
      console.log(`Project ${p.domain} already exists.`);
    }
  }

  console.log('Seeding finished successfully.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
