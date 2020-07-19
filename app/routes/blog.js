const express = require('express'),
  Article = require('../models/Articles'),
  router = express.Router()

const marked = require('marked'),
  slugify = require('slugify'),
  createDomPurify = require('dompurify'),
  { JSDOM } = require('jsdom'),
  dompurify = createDomPurify(new JSDOM().window)

const pageSetting = require('../../utils/PageSettings')
  .Builder('blog', 'Blog', null, null)

router.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('blog/index', { articles, pageSetting })
})

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  res.render('blog/show', { pageSetting, article })
})

module.exports = router
