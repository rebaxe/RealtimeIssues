/**
 * The starting point of the application.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

import express from 'express'
// import hbs from 'express-hbs'
import logger from 'morgan'
// import { dirname, join } from 'path'
// import { fileURLToPath } from 'url'
import { router } from './routes/router.js'
// import { connectDB } from './config/mongoose.js'

/**
 * The main function of the application.
 */
const main = async () => {
  // await connectDB()

  const app = express()
  // const directoryFullName = dirname(fileURLToPath(import.meta.url))

  const baseURL = process.env.BASE_URL || '/'

  // Set up a morgan logger using the dev format for log entries.
  app.use(logger('dev'))

  // View engine setup.
  // app.engine('hbs', hbs.express4({
  //   defaultLayout: join(directoryFullName, 'views', 'layouts', 'default'),
  //   partialsDir: join(directoryFullName, 'views', 'partials')
  // }))
  // app.set('view engine', 'hbs')
  // app.set('views', join(directoryFullName, 'views'))

  // Parse requests of the content type application/x-www-form-urlencoded.
  // Populates the request object with a body object (req.body).
  // app.use(express.urlencoded({ extended: false }))

  // Parse requests of the content type application/json.
  app.use(express.json())

  // Serve static files.
  // app.use(express.static(join(directoryFullName, '..', 'public')))

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    // Pass the base URL to views.
    res.locals.baseURL = baseURL
    next()
  })

  // Register routes.
  app.use('/', router)

  app.use(function (err, req, res, next) {
    // 404 Not Found.
    if (err.status === 404) {
      return res
        .status(404)
    }
    // 403 Forbidden.
    if (err.status === 403) {
      return res
        .status(403)
    }
  })

  // Start server and listen on port.
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl+C to terminate.')
  })
}

main().catch(console.error)
