module.exports = {
  sessionChecker: (req, res, next) => {
    if (req.cookies.user_sid && req.session.user) {
      res.redirect('/auth/dashboard')
    } else {
      next()
    }
  },

  loggedInChecker: (req, res, next) => {
    if (!req.session.user) {
      res.redirect('/auth/login')
    } else {
      next()
    }
  },
}