import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../utils/constants';

const signToken = (user: any) =>
  jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as jwt.SignOptions);

export const authService = {
  register: async (data: any) => {
    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) throw new AppError('Email already in use', HTTP_STATUS.CONFLICT);
    const hash = await bcrypt.hash(data.password, 10);
    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: hash,
      role: 'CITIZEN',
      phone: data.phone,
      division: data.division,
      district: data.district,
      address: data.address,
    });
    const token = signToken(user);
    return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
  },
  login: async (email: string, password: string) => {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
    const token = signToken(user);
    return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
  },
};
