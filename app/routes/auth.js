const flash = require('express-flash'),
  { sessionChecker, loggedInChecker } = require('../middlewares/authentication')

const express = require('express'),
  User = require('../models/User'),
  Flasher = require('../../utils/Flash'),
  router = express.Router()

const pageSetting = require('../../utils/PageSettings')
  .Builder('auth', 'Auth', null, null)


// dashboard
router.get('/dashboard', loggedInChecker, (req, res) => {
  pageSetting.titlePage = 'Dashboard'
  let info, show = req.flash('show')
  const user = req.session.user

  if (show[0] == true) {
    info = Flasher.getInstance()
      .setShow(Flasher._value.show.APPEARS)
      .setMessage(req.flash(Flasher._key.MESSAGE))
      .setType(req.flash(Flasher._key.TYPE))
      .get()
  } else {
    info = Flasher.getDefault()
  }

  res.render('auth/dashboard', { pageSetting, info, user })
})


// login
router.route('/login')
  .get(sessionChecker, (req, res) => {
    pageSetting.titlePage = 'Login'
    let info, show = req.flash('show')
    const user = req.session.user

    if (show[0] == true) {
      info = Flasher.getInstance()
        .setShow(Flasher._value.show.APPEARS)
        .setMessage(req.flash(Flasher._key.MESSAGE))
        .setType(req.flash(Flasher._key.TYPE))
        .get()
    } else {
      info = Flasher.getDefault()
    }

    res.render('auth/login', { pageSetting, info, user })
  })

  .post(async (req, res) => {
    try {
      User.findOne({ username: req.body.username }, (err, user) => {
        if (err || !user) {
          req.flash(Flasher._key.SHOW, Flasher._value.show.APPEARS)
          req.flash(Flasher._key.TYPE, Flasher._value.type.ERROR)
          req.flash(Flasher._key.MESSAGE, 'Login failed!')
          res.redirect('/auth/login')
          return;
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
          if (err || !isMatch) {
            req.flash(Flasher._key.SHOW, Flasher._value.show.APPEARS)
            req.flash(Flasher._key.TYPE, Flasher._value.type.ERROR)
            req.flash(Flasher._key.MESSAGE, 'Login failed!')
            res.redirect('/auth/login')
          } else {
            req.flash(Flasher._key.SHOW, Flasher._value.show.APPEARS)
            req.flash(Flasher._key.TYPE, Flasher._value.type.SUCCESS)
            req.flash(Flasher._key.MESSAGE, 'Logged in successfully')

            // set session
            req.session.user = user
            res.redirect('/auth/dashboard')
          }
        })
      })
    } catch (e) {
      req.flash(Flasher._key.SHOW, Flasher._value.show.APPEARS)
      req.flash(Flasher._key.TYPE, Flasher._value.type.ERROR)
      req.flash(Flasher._key.MESSAGE, 'Login failed!')
      res.redirect('/dashboard')
      res.redirect('/auth/login')
    }
  })


// register
router.route('/register')
  .get(sessionChecker, (req, res) => {
    pageSetting.titlePage = 'Register'
    let info, show = req.flash('show')

    if (show[0] == true) {
      info = Flasher.getInstance()
        .setShow(Flasher._value.show.APPEARS)
        .setMessage(req.flash(Flasher._key.MESSAGE))
        .setType(req.flash(Flasher._key.TYPE))
        .get()
    } else {
      info = Flasher.getDefault()
    }

    res.render('auth/register', { pageSetting, info })
  })
  .post(async (req, res) => {
    const name = req.body.name
    const username = req.body.username
    const password = req.body.password
    const password2 = req.body.password2

    if (password !== password2) {
      req.flash(Flasher._key.SHOW, Flasher._value.show.APPEARS)
      req.flash(Flasher._key.TYPE, Flasher._value.type.ERROR)
      req.flash(Flasher._key.MESSAGE, 'Password must be the same!')
      res.redirect('/auth/register')
      return;
    }

    try {
      let user = new User({ name, username, password })
      user = await user.save()

      req.flash(Flasher._key.SHOW, Flasher._value.show.APPEARS)
      req.flash(Flasher._key.TYPE, Flasher._value.type.SUCCESS)
      req.flash(Flasher._key.MESSAGE, 'Registered successfully! Please log in to see more.')
      res.redirect('/auth/login')

    } catch (e) {

      req.flash(Flasher._key.SHOW, Flasher._value.show.APPEARS)
      req.flash(Flasher._key.TYPE, Flasher._value.type.ERROR)
      req.flash(Flasher._key.MESSAGE, 'Register failed!')
      res.redirect('/auth/register')
      res.redirect('/auth/register')
      throw e
    }
  })

router.get('/logout', sessionChecker, (req, res) => {
  if (req.cookies.user_sid && req.session.user) {
    req.session.user = null
    res.clearCookie('user_sid')
  }

  req.flash(Flasher._key.SHOW, Flasher._value.show.APPEARS)
  req.flash(Flasher._key.TYPE, Flasher._value.type.SUCCESS)
  req.flash(Flasher._key.MESSAGE, 'Logout successfully!')
  res.redirect('/auth/login')
})

module.exports = router