import express from 'express'
import siteControllers from '../controllers/site.controller.js'
const router = express.Router()

router.get('/profile', siteControllers.renderRecuriterProfilePage)
router.get('/profile/dashboard', siteControllers.renderRecuriterDashBoard)

// job
router.get('/profile/jobs', siteControllers.renderJobsPage)
router.get('/add/job', siteControllers.renderAddJobPage)
router.get('/update/job/:id', siteControllers.renderUpdateJobPage)

// settings
router.get('/profile/settings', siteControllers.renderRecuriterSettings)

export default router