export const authenticate = (req, res, next) => {
  // console.log("Session ID:", req.sessionID); // Log the session ID
  // console.log("Session:", req.session); // Log the session content
  // console.log("Raw Cookie Header:", req.headers.cookie);
  // console.log("Cookies:", req.cookies); // Log cookies sent by the browser
  // console.log("User:", req.user); // Log user information stored in session
  if (req.isAuthenticated()) {
    return next();
  }

  // if(req.session.user) {
  //   return next()
  // }
  // console.log("req:", req)
  res.status(401).json('Unauthorized');
};
