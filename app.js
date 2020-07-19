const express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  { sessionChecker, loggedInChecker } = require('./app/middlewares/authentication'),
  flash = require('express-flash'),
  app = express(),
  PORT = process.env.PORT || 3000


/* MONGOOSE CONNECTION */
mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true)


/* UTILS */
// file uploader utils
const upload = require('./utils/FileUploader')
  .init('file', 'public/images/', 'siswa')
// page setting utils
const pageSetting = require('./utils/PageSettings')
  .Builder('home', 'Home', null, null)


/* ROUTERS */
const authRouter = require('./app/routes/auth')
const adminRouter = require('./app/routes/admin')
const userRouter = require('./app/routes/user')
const blogRouter = require('./app/routes/blog')
const authorRouter = require('./app/routes/author')


/* SET MIDDLEWARE */
app.use(bodyParser.urlencoded({ extended: false }))
// init cookie-parser
app.use(cookieParser())
// init express-session
app.use(session({
  key: 'user_sid',
  secret: 'harusRandomString',
  saveUninitialized: true,
  resave: false,
  cookie: {
    expires: 60 * 1000
  },
}))
// session checker
app.use((req, res, next) => {
  if (req.session.user_sid && !req.session.user) {
    res.clearCookie('user_sid')
  }
  next()
})
app.use(flash())
app.use(express.json())
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/app/views')


/* ROUTE ENDPOINTS */
app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/user', userRouter)
app.use('/blog', blogRouter)
app.use('/author', authorRouter)

app.get('/', (req, res) => {
  const user = req.session.user
  res.render('index', { pageSetting, user })
})

/* APP */
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.....`))