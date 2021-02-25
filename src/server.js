/**
 * The starting point of the application.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

import express from 'express'
import hbs from 'express-hbs'
// import session from 'express-session'
import helmet from 'helmet'
import logger from 'morgan'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { router } from './routes/router.js'
import http from 'http'
import { Server } from 'socket.io'

/**
 * The main function of the application.
 */
const main = async () => {
  const app = express()
  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  app.use(helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': [
        "'self'",
        'https://ka-f.fontawesome.com',
        'https://kit.fontawesome.com',
        'cdn.jsdelivr.net',
        "'unsafe-eval'"
      ],
      'connect-src': ["'self'", 'https://ka-f.fontawesome.com'],
      'img-src': ["'self'", 'https://gitlab.lnu.se', 'https://secure.gravatar.com']
    }
  })
  )

  const baseURL = process.env.BASE_URL || '/'

  // const sessionSecret = process.env.SESSION_SECRET

  // Set up a morgan logger using the dev format for log entries.
  app.use(logger('dev'))

  // View engine setup.
  app.engine('hbs', hbs.express4({
    defaultLayout: join(directoryFullName, 'views', 'layouts', 'default'),
    partialsDir: join(directoryFullName, 'views', 'partials')
  }))
  app.set('view engine', 'hbs')
  app.set('views', join(directoryFullName, 'views'))

  // Parse requests of the content type application/x-www-form-urlencoded.
  // Populates the request object with a body object (req.body).
  app.use(express.urlencoded({ extended: false }))

  // Enable body parsing of application/json
  // Populates the request object with a body object (req.body).
  app.use(express.json())

  // Serve static files.
  app.use(express.static(join(directoryFullName, '..', 'public')))

  app.set('trust proxy', 1)

  // Session middleware - setup and use.
  // app.use(session({
  //   name: 'snippetSessionID',
  //   secret: sessionSecret,
  //   resave: false,
  //   saveUninitialized: false,
  //   cookie: {
  //     httpOnly: true,
  //     secure: true,
  //     maxAge: 1000 * 60 * 120,
  //     sameSite: 'lax'
  //   }
  // }))

  // Add socket.io to the server.
  const server = http.createServer(app)
  const io = new Server(server)

  // Log connections/disconnections.
  io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    // Flash messages - survives only a round trip.
    // if (req.session.flash) {
    //   res.locals.flash = req.session.flash
    //   delete req.session.flash
    // }
    // Pass the base URL to views.
    res.locals.baseURL = baseURL

    // Add socket.io to response-objects.
    res.io = io

    next()
  })

  // Register routes.
  app.use('/', router)

  app.use(function (err, req, res, next) {
    // 404 Not Found.
    if (err.status === 404) {
      return res
        .status(404)
        .sendFile(join(directoryFullName, 'views', 'errors', '404.html'))
    }
  })

  // Start server and listen on port.
  server.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl+C to terminate.')
  })
}

main().catch(console.error)
