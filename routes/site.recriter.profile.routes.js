import express from 'express'
import siteControllers from '../controllers/site.controller.js'
const router = express.Router()

router.get('/', siteControllers.renderRecuriterProfilePage)

export default router