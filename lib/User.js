import { getFirestore } from 'firebase-admin/firestore';
import AppError from '../utils/appError.js';
import { uploadBuffer, deleteFile } from '../utils/cloudinary.js';

const db = getFirestore();

const getUserSnapshot = async (uid) => {
  const users = [];

  const usersSnapshot = await db
    .collection('users')
    .where(uid ? 'uid' : 'isAdmin', '==', uid || false)
    .get();

  usersSnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
};
const User = () => {
  const getAllNonAdminUsers = async () => {
    const users = await getUserSnapshot();
    return users;
  };

  const updateUserCompanyInfo = async (uid, companyDetails) => {
    const users = await getUserSnapshot(uid);

    await db.collection('users').doc(users[0]?.id).update({ companyDetails });

    const [updatedUser] = await getUserSnapshot(uid);
    return updatedUser;
  };

  const updateUserCompanyLogo = async (uid, processedCompanyPhoto, next) => {
    const user = await getUserSnapshot(uid);
    if (!user?.length) return next(new AppError('User not found.', 401));

    if (user[0]?.companyDetails?.cloudinaryId) {
      await deleteFile(user[0]?.companyDetails?.cloudinaryId);
    }

    // Upload the proccesed buffer image
    const uploadedImage = await uploadBuffer(
      processedCompanyPhoto,
      'companies',
    );

    // Attach uploaded image file credentials to the user object
    await updateUserCompanyInfo(uid, {
      ...user[0]?.companyDetails,
      logo: uploadedImage?.secure_url,
      cloudinaryId: uploadedImage?.public_id,
    });
    return getAllNonAdminUsers();
  };

  return {
    getAllNonAdminUsers,
    updateUserCompanyInfo,
    updateUserCompanyLogo,
  };
};

export default User();
