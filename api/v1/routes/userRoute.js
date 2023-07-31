import { Router } from 'express';
import { header, body, param } from 'express-validator';
import {
  AsyncMiddleware,
  AuthMiddleware,
  SharedMiddleware,
} from '../../../middlewares/index.js';
import UserController from '../controllers/UserController.js';
import upload from '../../../utils/multer.js';

const router = Router();

router.get(
  '/',
  [
    header('authorization', 'Please specify an authorization header').exists(),
    AsyncMiddleware(AuthMiddleware([{ isAdmin: true }])),
  ],
  AsyncMiddleware(UserController.getAll),
);
router.put(
  '/updateUser',
  [
    header('authorization', 'Please specify an authorization header').exists(),
    body('companyName', 'Failed! Company Name cant be blank')
      .exists()
      .bail()
      .isString()
      .withMessage('Failed! Company Name must be a string')
      .trim(),
    body('numUsers')
      .exists()
      .bail()
      .isInt({ allow_leading_zeroes: false })
      .withMessage('Failed! Number of Users must be a number'),
    body('numProducts')
      .exists()
      .bail()
      .isInt({ allow_leading_zeroes: false })
      .withMessage('Failed! Number of Products must be a number'),
    body('percentage')
      .exists()
      .bail()
      .isNumeric({ no_symbols: true })
      .withMessage('Failed! percentage must be a number'),
    AsyncMiddleware(AuthMiddleware([{ isAdmin: false }])),
  ],
  AsyncMiddleware(UserController.updateUser),
);

router.patch(
  '/uploadLogo/:uid',
  [
    header('authorization', 'Please specify an authorization header').exists(),
    param('uid', 'Failed! User uid is required')
      .exists()
      .bail()
      .isString()
      .withMessage('Failed! uid must be a string')
      .trim(),
    AsyncMiddleware(AuthMiddleware([{ isAdmin: true }])),
    upload.single('companyLogo'),
    SharedMiddleware.companyLogo,
  ],
  AsyncMiddleware(UserController.updateCompanyLogo),
);

export default router;
