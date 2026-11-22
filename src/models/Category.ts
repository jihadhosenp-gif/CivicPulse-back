import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  nameBn: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    nameBn: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.index({ name: 1 });
categorySchema.index({ isActive: 1 });

export const Category: Model<ICategory> = mongoose.model<ICategory>('Category', categorySchema);