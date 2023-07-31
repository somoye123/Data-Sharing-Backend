import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadBuffer = (bufferFile, folderName) => new Promise((resolve, reject) => {
  const cldUploadStream = cloudinary.uploader.upload_stream(
    {
      folder: `${folderName}`,
    },
    (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    },
  );

  streamifier.createReadStream(bufferFile).pipe(cldUploadStream);
});

export const deleteFile = async (fileId) => {
  await cloudinary.uploader.destroy(fileId);
};
