import passport from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../../schemas/userSchema.js';
import { comparePassword } from '../../utils/useBcrypt.js';

// takes validated user and stores into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.findById(id);
    if (!findUser) {
      return done(null, false, { message: 'User Not Found' });
    }
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) {
        const error = new Error('User not found');
        error.status = 401;
        throw error;
      }

      const match = await comparePassword(password, findUser.password);
      if (!match) {
        const error = new Error('Wrong Credentials');
        error.status = 401;
        throw error;
      }
      return done(null, findUser);
    } catch (err) {
      return done(err, null);
    }
  }),
);
