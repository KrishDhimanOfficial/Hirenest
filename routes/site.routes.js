import express from 'express'
import passport from 'passport'
import siteControllers from '../controllers/site.controller.js'
import usersControllers from '../controllers/users.controller.js'
import { upload, userInfo } from '../middleware/multer.middleware.js'
import handlemulterError from '../middleware/handleMulterErrors.js'
const router = express.Router()

router.get('/', siteControllers.renderHomePage)
router.route('/signup')
    .get((req, res) => res.render('site/signup', { layout: 'layout/site', title: 'Signup', endApi: 'signup' }))
    .post(upload.none(), usersControllers.createUser)

router.route('/login')
    .get((req, res) => res.render('site/login', { layout: 'layout/site', title: 'Login', endApi: 'login' }))
    .post((req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err)
            if (!user) return res.status(401).render('site/login', {
                layout: false,
                title: 'Login',
                error: 'Incorrect Email & Password.'
            })

            req.logIn(user, (err) => {
                if (err) return next(err)
                return res.redirect('/')
            })
        })(req, res, next)
    })

router.route('/user/:id?')
    .get(usersControllers.getuserInfo)
    .put(userInfo.fields(
        [
            { name: 'image', maxCount: 1 },
            { name: 'resume', maxCount: 1 }
        ]
    ),
        handlemulterError,
        usersControllers.updateuserInfo)
    .delete(usersControllers.deleteuserInfo)

// router.route('/user/project/:id?')
router.get('/*', (req, res) => res.status(404).render('site/partials/error', {
    layout: 'layout/site',
    title: '404'
}))

export default router