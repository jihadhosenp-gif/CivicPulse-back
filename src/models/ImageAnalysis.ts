import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IImageAnalysis extends Document {
  reportId?: mongoose.Types.ObjectId;
  imageUrl: string;
  analysis: Record<string, any>;
}

const schema = new Schema<IImageAnalysis>(
  {
    reportId: { type: Schema.Types.ObjectId, ref: 'Report' },
    imageUrl: { type: String, required: true },
    analysis: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const ImageAnalysis: Model<IImageAnalysis> = mongoose.model<IImageAnalysis>('ImageAnalysis', schema);
