import { v2 as cloudinary } from 'cloudinary';
import config from './index';

if (config.cloudinaryCloudName && config.cloudinaryApiKey && config.cloudinaryApiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  });
  console.log('[config] Cloudinary configured');
} else {
  console.warn('[config] Cloudinary credentials not set; image upload will be unavailable');
}

export default cloudinary;