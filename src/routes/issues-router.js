/**
 * Issues routes.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

import express from 'express'
import { IssuesController } from '../controllers/issues-controller.js'

export const router = express.Router()

const controller = new IssuesController()

router.get('/', controller.index)

router.get('/new', controller.new)
router.post('/create', controller.create)

router.get('/:id/close', controller.close)
router.get('/:id/reopen', controller.reopen)
