/**
 * The routes.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

import express from 'express'
import { router as homeRouter } from './home-router.js'
import { router as issuesRouter } from './issues-router.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/issues', issuesRouter)

router.use('*', (req, res, next) => {
  const error = new Error()
  error.status = 404
  error.message = 'Not Found'
  next(error)
})
