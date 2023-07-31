import User from '../../../lib/User.js';

const UserController = () => {
  const getAll = async (req, res) => {
    const users = await User.getAllNonAdminUsers();
    return res.status(200).json({ data: users });
  };

  const updateCompanyLogo = async (
    { file: { processedCompanyPhoto }, params: { uid } },
    res,
    next
  ) => {
    const users = await User.updateUserCompanyLogo(
      uid,
      processedCompanyPhoto,
      next
    );
    if (users) return res.status(200).json({ data: users });
  };

  const updateUser = async (req, res) => {
    const user = await User.updateUserCompanyInfo(req.uid, req.body);
    return res.status(200).json({ data: user });
  };

  return {
    getAll,
    updateCompanyLogo,
    updateUser,
  };
};

export default UserController();
