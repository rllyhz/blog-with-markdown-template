const crypto = require('crypto'),
  uuid = require('uuid')

module.exports = {
  makeId: () => uuid.v4(),
  generateRandomString: length => crypto.randomBytes(length).toString('hex')
}