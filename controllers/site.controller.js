import { Country, State, City } from 'country-state-city'
import skillModel from '../models/skill.model.js'
import userModel from '../models/user.model.js'
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
            if (req.user?.image && req.user.resume) return res.redirect(`/profile/${req.user?.name}`)
            return res.render('layout/site',
                {
                    body: '../site/candidate/userProfile',
                    title: `Profile`,
                    subtitle: `Profile - ${req.user?.name}`,
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
    renderUserDashboard: async (req, res) => {
        try {
            const country = req.user?.location.country;
            const state = req.user?.location.state;
            const city = req.user?.location.city;

            const skills = await userModel.aggregate([
                {
                    $lookup: {
                        from: 'jobskills',
                        localField: 'skills',
                        foreignField: '_id',
                        as: 'skills'
                    }
                },
                { $unwind: "$skills" },
                { $replaceRoot: { newRoot: '$skills' } }
            ])
            return res.render('layout/site',
                {
                    body: '../site/candidate/dashboard',
                    profilelayout: './userProfile',
                    title: `Profile`,
                    subtitle: `Profile - ${req.user?.name}`,
                    endApi: `api/user`,
                    user: req.user,
                    skills,
                    country: Country.getCountryByCode(country),
                    state: State.getStateByCodeAndCountry(state, country),
                    city: City.getCitiesOfState(country, state).filter(c => c.name === city)[0]
                })
        } catch (error) {
            console.log('renderUserDashboard : ' + error.message)
        }
    },
    renderProfileSettings: async (req, res) => {
        try {
            return res.render('layout/site',
                {
                    body: '../site/candidate/dashboard',
                    profilelayout: './settings',
                    title: `Profile`,
                    subtitle: `Profile - ${req.user?.name}`,
                    endApi: 'api/user',
                    user: req.user,
                })
        } catch (error) {
            console.log('renderProfileSettings  : ' + error.message)
        }
    },
    renderUserProjects: async (req, res) => {
        try {
            return res.render('layout/site',
                {
                    body: '../site/candidate/dashboard',
                    profilelayout: './projects',
                    title: `Profile`,
                    subtitle: `Profile - ${req.user?.name}`,
                    endApi: '',
                    user: req.user,
                })
        } catch (error) {
            console.log('renderUserProjects : ' + error.message)
        }
    },
}

export default siteControllers