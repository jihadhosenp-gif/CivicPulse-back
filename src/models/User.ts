import mongoose, { Schema, Document, Model } from 'mongoose';
import { ROLES, Role } from '../utils/constants';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  division?: string;
  district?: string;
  address?: string;
  profileImage?: string;
  isActive: boolean;
  emailVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  refreshToken?: string;
  lastLoginAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ROLES, required: true },
    phone: { type: String },
    division: { type: String },
    district: { type: String },
    address: { type: String },
    profileImage: { type: String },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    refreshToken: { type: String },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);