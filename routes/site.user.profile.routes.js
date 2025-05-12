import express from 'express'
import siteControllers from '../controllers/site.controller.js'
const router = express.Router()

router.get('/', siteControllers.renderProfilePage)
router.get('/settings', siteControllers.renderProfileSettings)
router.get('/:name/education', siteControllers.renderUserEducation)
router.get('/:name/projects', siteControllers.renderUserProjects)
router.get('/:name/experience', siteControllers.renderUserExperience)
router.get('/:name', siteControllers.renderUserDashboard)


export default router