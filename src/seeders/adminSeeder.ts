import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import config from '../config';
import { User } from '../models/User';
import { ROLES } from '../utils/constants';

export const seedAdmin = async (): Promise<void> => {
  try {
    if (!config.mongoUri) {
      console.warn('[seeder] MONGO_URI not set; skipping admin seed');
      return;
    }
    await mongoose.connect(config.mongoUri);
    const existing = await User.findOne({ email: config.adminEmail.toLowerCase() });
    if (existing) {
      console.log('[seeder] Admin already exists; skipping');
      return;
    }
    const hash = await bcrypt.hash(config.adminPassword, 10);
    await User.create({
      name: 'Super Admin',
      email: config.adminEmail.toLowerCase(),
      password: hash,
      role: ROLES[2],
      isActive: true,
    });
    console.log('[seeder] Admin seeded successfully');
  } catch (error) {
    console.error('[seeder] Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();