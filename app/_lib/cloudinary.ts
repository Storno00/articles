import axios from 'axios';
import CryptoJS from 'crypto-js';

const CLOUDINARY_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

export async function uploadImage(image: File) {
  const reqFormData = new FormData();
  reqFormData.append('file', image);
  reqFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  reqFormData.append('cloud_name', CLOUDINARY_NAME);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
      reqFormData
    );
    return {
      url: response.data.secure_url,
      id: response.data.public_id,
    };
  } catch (error) {
    console.error('Error uploading the image:', error);
  }
}

export async function deleteImage(publicId: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const hash = CryptoJS.SHA1(signatureString).toString();

  const reqFormData = new FormData();
  reqFormData.append('public_id', publicId);
  reqFormData.append('timestamp', timestamp);
  reqFormData.append('api_key', CLOUDINARY_API_KEY);
  reqFormData.append('signature', hash);
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/destroy`,
      reqFormData
    );
    return { message: 'Image deleted successfully!', response };
  } catch (error) {
    console.error('Error deleting the image:', error);
    throw new Error('Failed to delete image');
  }
}
