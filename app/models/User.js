const mongoose = require('mongoose'),
  bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
    default: 2,
  },
})

userSchema.pre('save', function (next) {
  const user = this
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()
  // generate a salt
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err)
    // hash the password using new salt
    bcrypt.hash(user.password, salt, function (err, encryptedPassword) {
      if (err) return next(err)
      // override the old password with the encrypted one.
      user.password = encryptedPassword
      next()
    })
  })
})

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch)
  })
}


module.exports = mongoose.model('User', userSchema)