const User = require("../models/User");
const { CustomError } = require("../middlewares/error");

const getUserController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("No user found", 404);
    }
    const { password, ...data } = user._doc;
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserController };
