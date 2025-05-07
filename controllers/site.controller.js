import { Country, State, City } from 'country-state-city'
import skillModel from '../models/skill.model.js'
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
            if (!req.user) return res.redirect('/login')
            return res.render('layout/site',
                {
                    body: '../site/candidate/userProfile',
                    title: `Profile - ${req.user?.name}`,
                    endApi: `api/user`,
                    user: req.user
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
    getCounteries: async (req, res) => {
        try {
            const { q } = req.query;
            const regex = new RegExp(q, 'i')
            const countries = Country.getAllCountries().filter(cn => regex.test(cn.name))
            return res.status(200).json(countries)
        } catch (error) {
            console.log('getCounteries : ' + error.message)
        }
    },
    getStates: async (req, res) => {
        try {
            const { q } = req.query;
            const states = State.getStatesOfCountry(q)
            return res.status(200).json(states)
        } catch (error) {
            console.log('getStates : ' + error.message)
        }
    },
    getcities: async (req, res) => {
        try {
            const { s, c } = req.query;
            const cities = City.getCitiesOfState(c, s)
            return res.status(200).json(cities)
        } catch (error) {
            console.log('getcities : ' + error.message)
        }
    },
    getSkills: async (req, res) => {
        try {
            const response = await skillModel.aggregate([
                {
                    $match: {
                        name: {
                            $regex: req.query.skill, $options: 'i'
                        },
                        status: true
                    }
                }
            ])
            return res.status(200).json(response)
        } catch (error) {
            console.log('getSkills : ' + error.message)
        }
    },
}

export default siteControllers