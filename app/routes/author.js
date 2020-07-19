const express = require('express'),
  router = express.Router()

const pageSetting = require('../../utils/PageSettings')
  .Builder('author', 'Authors', null, null)

router.get('/:author', async (req, res) => {
  res.send(`Hallo, ${req.params.author}`)
})

module.exports = router
