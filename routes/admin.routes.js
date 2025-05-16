import express from 'express'
import adminControllers from '../controllers/admin.controller.js'
import jobAttributesController from '../controllers/job.attributes.controller.js'
import { isAuthenticated } from '../middleware/authentication.js'
import passport from 'passport'
import { sitelogo, upload } from '../middleware/multer.middleware.js'
import usersControllers from '../controllers/users.controller.js'
import handlemulterError from '../middleware/handleMulterErrors.js'
const router = express.Router()

router.get('/api/general-settings', adminControllers.getGeneralSettings)
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err)
        req.session.destroy(() => {
            res.clearCookie('connect.sid')
            return res.redirect('/dashboard/login')
        })
    })
})

router.route('/login')
    .get((req, res) => res.render('admin/login', { layout: false, title: 'Login' }))
    .post((req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err)
            if (!user) return res.status(401).render('admin/login', {
                layout: false,
                title: 'Login',
                error: 'Incorrect Email & Password.'
            })

            req.logIn(user, (err) => {
                if (err) return next(err)
                return res.redirect('/dashboard')
            })
        })(req, res, next)
    })

router.use(isAuthenticated)
router.get('/', adminControllers.renderDashboard)


router.get('/job/category', adminControllers.renderJobCategory)
router.route('/job-category/:id?')
    .post(upload.none(), jobAttributesController.createJob_category)
    .get(jobAttributesController.getSingle_job_category)
    .put(upload.none(), jobAttributesController.updateJob_category)
    .patch(jobAttributesController.updateJob_category_status)
    .delete(jobAttributesController.deleteJob_category)

router.get('/job/degree', adminControllers.renderJobDegree)
router.route('/job-degree/:id?')
    .post(upload.none(), jobAttributesController.createJob_degree)
    .get(jobAttributesController.getSingleJob_degree)
    .put(upload.none(), jobAttributesController.updateJob_degree)
    .patch(jobAttributesController.updateJob_degree_status)
    .delete(jobAttributesController.deleteJob_degree)

router.get('/job/industry', adminControllers.renderJobIndustry)
router.route('/job-industry/:id?')
    .post(upload.none(), jobAttributesController.createJob_industry)
    .get(jobAttributesController.getSingleJob_industry)
    .put(upload.none(), jobAttributesController.updateJob_industry)
    .patch(jobAttributesController.updateJob_industry_status)
    .delete(jobAttributesController.deleteJob_industry)

router.get('/job/tags', adminControllers.renderJobTag)
router.route('/job-tag/:id?')
    .post(upload.none(), jobAttributesController.createJob_tag)
    .get(jobAttributesController.getSingleJob_tag)
    .put(upload.none(), jobAttributesController.updateJob_tag)
    .delete(jobAttributesController.deleteJob_tag)

router.get('/job/types', adminControllers.renderJobType)
router.route('/job-type/:id?')
    .post(upload.none(), jobAttributesController.createJob_type)
    .get(jobAttributesController.getSingleJob_type)
    .put(upload.none(), jobAttributesController.updateJob_type)
    .delete(jobAttributesController.deleteJob_type)

router.get('/job/skills', adminControllers.renderJobSkills)
router.route('/job-skill/:id?')
    .post(upload.none(), jobAttributesController.createJob_Skill)
    .get(jobAttributesController.getSingleJob_Skill)
    .put(upload.none(), jobAttributesController.updateJob_Skill)
    .patch(jobAttributesController.updatejob_skillStatus)
    .delete(jobAttributesController.deleteJob_skill)

// site users
router.get('/users', adminControllers.renderUsers)
router.patch('/user/:id', usersControllers.updateUserActiveStatus)
router.delete('/user/:id', usersControllers.deleteuserInfo)

//settings
router.route('/setting/term&condition')
    .get(adminControllers.renderTerms_CondtionPage)
    .post(upload.none(), adminControllers.setSiteTerms)


router.route('/setting/general-settings')
    .get(adminControllers.renderGeneralSettings)
    .post(sitelogo.single('logo'), handlemulterError, adminControllers.setGeneralSettings)

router.get('/*', (req, res) => res.status(404).render('admin/partials/NotFound', {
    layout: false,
    title: '404'
}))


// router.use((err, req, res, next) => {
//     return res.status(404).redirect('/dashboard/login')
// })

export default router