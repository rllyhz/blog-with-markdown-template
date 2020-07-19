const express = require('express'),
  User = require('../models/User'),
  router = express.Router()

const pageSetting = require('../../utils/PageSettings')
  .Builder('user', 'Users', null, null)

router.route('/')
  .get(async (req, res) => {
    req.flash('message', 'success')
    res.send('message')
  })

router.delete('/deleteAll', async (req, res) => {
  const users = await User.find().sort({ name: 'desc' })
  users.forEach(async user => {
    await User.findByIdAndDelete(user._id)
  })
})

module.exports = router