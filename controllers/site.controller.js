import { Country } from 'country-state-city'
const siteControllers = {
    renderHomePage: async (req, res) => {
        try {
            return res.render('layout/site',
                {
                    body: '../site/home',
                    title: 'Home'
                }
            )
        } catch (error) {
            console.log('renderHomePage : ' + error.message)
        }
    },
    renderProfilePage: async (req, res) => {
        try {
            return res.render('layout/site',
                {
                    body: '../site/candidate/userProfile',
                    title: `Profile - ${req.user?.name}`
                })
        } catch (error) {
            console.log('renderProfilePage : ' + error.message)
        }
    },
    renderRecuriterProfilePage: async (req, res) => {
        try {
            return res.render('layout/site',
                {
                    body: '../site/recuriter/userProfile',
                    title: `Profile - ${req.user?.name}`
                })
        } catch (error) {
            console.log('renderRecuriterProfilePage : ' + error.message)
        }
    },
}

export default siteControllers