import express from 'express'
import siteControllers from '../controllers/site.controller.js'
const router = express.Router()

router.get('/', siteControllers.renderProfilePage)

export default router