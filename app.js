import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import expressLayouts from 'express-ejs-layouts'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import passport from 'passport'
import session from 'express-session'
import flash from 'connect-flash'
import siteRoutes from './routes/site.routes.js'
import adminRoutes from './routes/admin.routes.js'
import passportconfig from './services/passportconfig.js'
import config from './config/config.js'

const app = express()

app.use(cors(
  {
    origin: config.siteURL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }
))
app.use(helmet(
  {
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  }
))
app.use(compression(
  {
    level: 2, // compression level
    threshold: 0, // Compress all
    memLevel: 9, // memory usuage
    filter: (req, res) => compression.filter(req, res)
  }
))
app.use(rateLimit(
  {
    windowMs: 1000, // 15 mins
    max: 10, // limit each IP
    message: 'Too many requests. Please try again later.'
  }
))

app.use(mongoSanitize())
app.use(xss())
app.use(logger('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session(
  {
    secret: config.securityKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
    }
  }
))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passportconfig(passport)

// view engine setup
app.set('views', app.use('/views', express.static('views')))
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(expressLayouts)

// folder setup
app.set('assets', app.use('/assets', express.static('assets')))

// routes 
app.use('/', siteRoutes)
app.use('/dashboard', adminRoutes)


app.use((err, req, res, next) => {
  const status = err.status || 500;
  return res.render('error', {
    message: err.message,
    status,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null
  })
})

export default app