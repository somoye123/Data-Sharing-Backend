export default (controllerMethod) => async (req, res, next) => {
  try {
    return await controllerMethod(req, res, next);
  } catch (error) {
    return next(error);
  }
};
