import express from 'express'
import siteControllers from '../controllers/site.controller.js'
const router = express.Router()

router.get('/profile', siteControllers.renderRecuriterProfilePage)
router.get('/profile/settings', siteControllers.renderRecuriterSettings)

export default router