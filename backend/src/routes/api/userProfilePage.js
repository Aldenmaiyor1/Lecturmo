import express from 'express';
import {
  checkUsername,
  checkEmail,
  checkPasswordsMatch,
  isValidUOAEmail,
} from '../../controllers/registerController.js';
import { comparePassword, hashPassword } from '../../utils/useBcrypt.js';
import { updateUser } from '../../controllers/userProfileController.js';
import crypto from 'crypto';
import { sendVerifyUniEmail } from '../../controllers/sendVerifyEmailController.js';
import { updateEmailToken } from '../../controllers/userProfileController.js';

const router = express.Router();

router.post('/update-user', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      gender,
      avatarURL,
      description,
      currentPassword,
      dateOfBirth,
    } = req.body;

    // Validate current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      req.user.password,
    );
    console.log('isCurrentPasswordValid:', isCurrentPasswordValid);
    if (!isCurrentPasswordValid) {
      return res.status(403).json({ message: 'Current password is invalid.' });
    }

    // Prepare update data
    const updateData = {};
    if (
      username &&
      (username !== req.user.username || (await checkUsername(username)))
    )
      updateData.username = username;
    if (email && (email !== req.user.email || (await checkEmail(email))))
      updateData.email = email;
    if (password && checkPasswordsMatch(password, confirmPassword)) {
      console.log('password:', password);
      updateData.password = await hashPassword(password);
    }
    if (firstName) updateData.fname = firstName;
    if (lastName) updateData.lname = lastName;
    if (description) updateData.profileDescription = description;
    if (gender) updateData.gender = gender;
    if (avatarURL) updateData.avatarPicture = avatarURL;
    if (dateOfBirth) updateData.dob = dateOfBirth;

    try {
      const user = await updateUser(req.user._id, updateData);
      res
        .status(200)
        .json({ message: 'Profile successfully updated', user: user });
    } catch (e) {
      console.log(e.message);
      res.status(400).json({ message: e.message });
    }
  } catch (e) {
    console.log(e.message);
  }
});

router.post('/resend-verification-email', async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!isValidUOAEmail(email)) {
      return res.status(403).json({
        message: 'Please update email to a valid University of Auckland email.',
      });
    }
    const emailToken = crypto.randomBytes(32).toString('hex');

    await updateEmailToken(req.user._id, { emailToken: emailToken });

    const response = await sendVerifyUniEmail(
      { username: username, emailToken: emailToken },
      email,
    );
    if (response.status === 'error') {
      return res.status(403).json({ message: response.message });
    } else {
      res.sendStatus(200);
    }
  } catch (e) {
    console.log(e.message);
  }

});
export default router;
