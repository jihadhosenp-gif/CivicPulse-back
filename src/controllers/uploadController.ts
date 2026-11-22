import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import cloudinary from '../config/cloudinary';

export const uploadImages = asyncHandler(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || [];
  const results = await Promise.all(
    files.map((f) =>
      new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'civicpulse/reports', resource_type: 'image' },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(f.buffer);
      })
    )
  );
  res.status(200).json({
    success: true,
    data: results.map((r) => ({ url: r.secure_url, publicId: r.public_id })),
  });
});

export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
  const { publicId } = req.body;
  await cloudinary.uploader.destroy(publicId);
  res.status(200).json({ success: true, message: 'Image deleted' });
});
