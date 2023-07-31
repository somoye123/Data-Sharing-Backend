import multer from 'multer';
import AppError from './appError.js';

// Multer config
export default multer({
  storage: multer.memoryStorage(),
  fileFilter: (_, file, cb) => {
    const { mimetype } = file;
    if (
      mimetype !== 'image/jpg'
      && mimetype !== 'image/png'
      && mimetype !== 'image/svg'
      && mimetype !== 'image/jpeg'
    ) {
      cb(
        new AppError(
          'The file is not an image. Please, upload only images.',
          400,
        ),
        false,
      );
      return;
    }
    cb(null, true);
  },
});
