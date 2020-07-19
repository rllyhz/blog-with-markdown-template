const multer = require("multer"),
  path = require('path'),
  random = require('./Random')


module.exports = {
  init: (fieldName, destination, prefix = "") => {
    const storage = multer.diskStorage({
      destination: path.join(__dirname + "/../" + destination.trim() + "/"),
      filename: (req, file, cb) => {
        if (file) {
          let fileName;
          if (prefix !== "") {
            fileName = prefix + "-" + Date.now() + "_id-" + random.makeId() + path.extname(file.originalname)
          } else {
            fileName = Date.now() + "_id-" + random.makeId() + path.extname(file.originalname)
          }

          cb(null, fileName)
        }
      }
    })

    return multer({
      storage,
    }).single(fieldName)
  },
}