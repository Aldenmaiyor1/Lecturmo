import { User } from '../schemas/userSchema.js';

export const updateUser = async (userId, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateEmailToken = async (userId, emailToken) => {
  try {
    const user = await User.findByIdAndUpdate(userId, emailToken, {
      new: true,
    });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};


