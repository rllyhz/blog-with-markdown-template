const express = require('express'),
  Article = require('../models/Articles'),
  router = express.Router()

const marked = require('marked'),
  slugify = require('slugify'),
  createDomPurify = require('dompurify'),
  { JSDOM } = require('jsdom'),
  dompurify = createDomPurify(new JSDOM().window)

const pageSetting = require('../../utils/PageSettings')
  .Builder('blog', 'Blog Admin', null, null)


router.route('/articles')
  .get(async (req, res) => {
    const user = req.session.user
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('admin/articles/index', { articles, pageSetting, user })
  })

  .post(async (req, res) => {
    try {
      let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        createdBy: 'rllyhz',
      })
      article = await article.save()
      res.redirect(`/admin/articles/show/${article.slug}`)
    } catch (e) {
      res.redirect(`/admin/articles/new`)
      throw e
    }
  })

router.get('/articles/new', (req, res) => {
  const user = req.session.user
  res.render('admin/articles/new', { pageSetting, user })
})

router.get('/articles/show/:slug', async (req, res) => {
  const user = req.session.user
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/articles')
  res.render('admin/articles/show', { article, pageSetting, user })
})

router.get('/articles/edit/:id', async (req, res) => {
  const user = req.session.user
  const article = await Article.findById(req.params.id)
  if (article == null) res.redirect('/articles')
  res.render('admin/articles/edit', { article, pageSetting, user })
})

router.post('/articles/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  if (article == null) res.redirect('/articles')

  try {
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    article.updatedAt = new Date()
    article = await article.save()
    res.redirect(`/admin/articles/show/${article.slug}`)
  } catch (e) {
    res.redirect('/admin/articles')
    throw e
  }
})

router.get('/articles/delete/:id', async (req, res) => {
  article = await Article.findById(req.params.id)
  try {
    article.delete()
    res.redirect(`/admin/articles`)
  } catch (e) {
    res.redirect(`/admin/articles`)
    throw e
  }
})

module.exports = router