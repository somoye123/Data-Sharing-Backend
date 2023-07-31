import sharp from 'sharp';
import AppError from '../../utils/appError.js';

export const companyLogo = async (req, res, next) => {
  if (!req.file) return next(new AppError('Image File is Required', 400));

  req.file.processedCompanyPhoto = await sharp(req.file.buffer)
    .resize(100, 100)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();

  return next();
};

export default { companyLogo };
