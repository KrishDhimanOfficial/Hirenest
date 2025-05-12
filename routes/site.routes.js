import express from 'express'
import passport from 'passport'
import siteControllers from '../controllers/site.controller.js'
import usersControllers from '../controllers/users.controller.js'
import { companylogo, upload, userInfo } from '../middleware/multer.middleware.js'
import { checkIsCandidate, checkIsRecruiter } from '../middleware/authentication.js'
import handlemulterError from '../middleware/handleMulterErrors.js'
import userProfileRoutes from './site.user.profile.routes.js'
import recuriterProfileRoutes from './site.recriter.profile.routes.js'
const router = express.Router()


router.get('/', siteControllers.renderHomePage)
router.get('/terms&condition', siteControllers.renderTermsPage)
router.route('/signup')
    .get((req, res) => res.render('layout/site', { body: '../site/signup', title: 'Signup', endApi: 'signup' }))
    .post(upload.none(), usersControllers.createUser)

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err)
        req.session.destroy(() => {
            res.clearCookie('connect.sid')
            return res.redirect('/login')
        })
    })
})
router.route('/login')
    .get((req, res) => res.render('layout/site', { body: '../site/login', title: 'Login', endApi: 'login' }))
    .post((req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err)
            if (!user) return res.status(401).render('layout/site', {
                body: '../site/login',
                title: 'Login',
                error: 'Incorrect Email & Password.'
            })

            req.logIn(user, (err) => {
                if (!user.isactive) return res.render('layout/site',
                    {
                        body: '../site/login',
                        title: 'Login',
                        endApi: 'login',
                        error: 'Your Account is Deactive.'
                    }
                )
                user.isrecuiter ? res.redirect('/recruiter/profile') : res.redirect('/profile')
            })
        })(req, res, next)
    })

router.route('/api/user')
    .get(usersControllers.getuserInfo)
    .put(userInfo.fields(
        [
            { name: 'image', maxCount: 1 },
            { name: 'resume', maxCount: 1 }
        ]
    ),
        handlemulterError,
        usersControllers.updateuserInfo)
    .patch(upload.none(), usersControllers.updateUserPassword)
    .delete(usersControllers.deleteuserInfo)


// Location API 
router.get('/api/countries', siteControllers.getCounteries)
router.get('/api/states', siteControllers.getStates)
router.get('/api/cities', siteControllers.getcities)

// Job skills
router.get('/api/job-skills', siteControllers.getSkills)

// Job Tags
router.get('/api/job-skills', siteControllers.getTags)

// Project
router.route('/api/user/project/:id?')
    .post(upload.none(), usersControllers.createUserProject)
    .get(usersControllers.get_userProject)
    .put(upload.none(), usersControllers.update_userProject)
    .delete(usersControllers.delete_userProject)

// Experience
router.route('/api/user/experience/:id?')
    .post(upload.none(), usersControllers.createuserExperience)
    .get(usersControllers.getuserExperience)
    .put(upload.none(), usersControllers.updateuserExperience)
    .delete(usersControllers.deleteuserExperience)

// Education
router.route('/api/user/education/:id?')
    .post(upload.none(), usersControllers.createEducation)
    .get(usersControllers.getSingleEducation)
    .put(upload.none(), usersControllers.updateEducation)
    .delete(usersControllers.deleteEducation)

router.route('/api/recruiter')
    .put(companylogo.single('image'), handlemulterError, usersControllers.updateRecruiterInfo)
    .patch(upload.none(), usersControllers.changeRecuriterPassword)
    .delete(usersControllers.deleteRecuirterInfo)

router.use('/profile', checkIsCandidate, userProfileRoutes)
router.use('/recruiter', checkIsRecruiter, recuriterProfileRoutes)

router.get('/*', (req, res) => res.status(404).render('layout/site', {
    body: '../site/partials/error',
    title: '404'
}))

export default router