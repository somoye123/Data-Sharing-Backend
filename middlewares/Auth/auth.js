import { validationResult } from 'express-validator';

// Middleware to verify Firebase token and check user role
import Firebase from '../../utils/firebase.js';

import AppError from '../../utils/appError.js';

export default (roles) => async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new AppError(errors.array()[0]?.msg, 401));

  const [, token] = req.headers.authorization.split(' ');

  if (!token) return next(new AppError('Unauthorized.', 401));

  const decodedToken = await Firebase.auth().verifyIdToken(token);

  const currentUser = [];

  const usersSnapshot = await Firebase.firestore()
    .collection('users')
    .where('uid', '==', decodedToken?.uid)
    .get();

  usersSnapshot.forEach((doc) => {
    currentUser.push(doc.data());
  });
  const isAuthorized = roles.find(
    ({ isAdmin }) => isAdmin === currentUser[0]?.isAdmin,
  );

  if (!isAuthorized) return next(new AppError('Unauthorized.', 401));

  req.uid = currentUser[0]?.uid;

  return next();
};
