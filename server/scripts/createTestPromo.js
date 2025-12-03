// Quick script to create test promo codes
// Run with: node scripts/createTestPromo.js

import mongoose from 'mongoose';
import PromoCode from '../models/PromoCode.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestPromos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create test promo codes
    const promos = [
      {
        code: 'WELCOME10',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minAmount: 0,
        validUntil: new Date('2025-12-31'),
        isActive: true,
        description: '10% off for new users'
      },
      {
        code: 'SAVE20',
        discountType: 'FIXED',
        discountValue: 20,
        minAmount: 100,
        validUntil: new Date('2025-12-31'),
        isActive: true,
        description: '$20 off on orders over $100'
      },
      {
        code: 'MOVIE50',
        discountType: 'PERCENTAGE',
        discountValue: 50,
        minAmount: 50,
        maxDiscount: 25,
        validUntil: new Date('2025-12-31'),
        isActive: true,
        description: '50% off (max $25 discount)'
      }
    ];

    for (const promo of promos) {
      try {
        await PromoCode.create(promo);
        console.log(`✓ Created promo code: ${promo.code}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠ Promo code ${promo.code} already exists`);
        } else {
          console.error(`✗ Error creating ${promo.code}:`, error.message);
        }
      }
    }

    console.log('\n✅ Test promo codes created!');
    console.log('\nYou can now test with:');
    console.log('- WELCOME10 (10% off)');
    console.log('- SAVE20 ($20 off, min $100)');
    console.log('- MOVIE50 (50% off, max $25)');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestPromos();

