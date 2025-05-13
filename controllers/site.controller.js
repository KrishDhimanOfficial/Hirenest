import { Country, State, City } from 'country-state-city'
import skillModel from '../models/skill.model.js'
import userModel from '../models/user.model.js'
import userProjectModel from '../models/user.project.model.js'
import handleAggregatePagination from '../services/handlepagePagination.js'
import educationModel from '../models/education.model.js'
import experienceModel from '../models/experience.model.js'
import site_settingsModel from '../models/site_settings.model.js'
import jobTagModel from '../models/job.tag.model.js'
import jobTypeModel from '../models/job.type.model.js'
import jobCategoryModel from '../models/job.category.model.js'
import jobDegreeModel from '../models/job.degree.model.js'
import jobIndustryTypeModel from '../models/job.industry.type.model.js'
import mongoose from 'mongoose'
import jobModel from '../models/job.model.js'

const siteControllers = {
    renderTermsPage: async (req, res) => {
        try {
            const settings = await site_settingsModel.find({})
            return res.render('layout/site',
                {
                    body: '../site/term',
                    title: 'Terms & Condition',
                    user: req.user,
                    setting: settings[0]
                }
            )
        } catch (error) {
            console.log('renderTermsPage : ' + error.message)
        }
    },
    renderHomePage: async (req, res) => {
        try {
            return res.render('layout/site',
                {
                    body: '../site/home',
                    title: 'Home',
                    user: req.user
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
    getTags: async (req, res) => {
        try {
            const response = await jobTagModel.aggregate([
                {
                    $match: {
                        name: {
                            $regex: req.query.tag, $options: 'i'
                        },
                    }
                }
            ])
            console.log(response);

            return res.status(200).json(response)
        } catch (error) {
            console.log('getTags : ' + error.message)
        }
    },
    getcategories: async (req, res) => {
        try {
            const response = await jobCategoryModel.aggregate([
                {
                    $match: {
                        name: {
                            $regex: req.query.category,
                            $options: 'i'
                        },
                        industryId: new mongoose.Types.ObjectId(req.query.industryId),
                        status: true
                    }
                }
            ])

            return res.status(200).json(response)
        } catch (error) {
            console.log('getcategories : ' + error.message)
        }
    },
    getdegrees: async (req, res) => {
        try {
            const response = await jobDegreeModel.aggregate([
                {
                    $match: {
                        name: {
                            $regex: req.query.degree,
                            $options: 'i'
                        },
                        status: true
                    }
                }
            ])

            return res.status(200).json(response)
        } catch (error) {
            console.log('getdegrees  : ' + error.message)
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
                    title: 'HireNest | Profile',
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
                    title: 'HireNest | Profile',
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
            const pipeline = [
                {
                    $match: { candidateId: req.user?._id }
                },
                { $sort: { _id: -1 } },
                { $project: { name: 1, url: 1, project_duration: 1 } }
            ]
            const projects = await handleAggregatePagination(userProjectModel, pipeline, req.query)

            return res.render('layout/site',
                {
                    body: '../site/candidate/dashboard',
                    profilelayout: './projects',
                    title: 'HireNest | Profile',
                    subtitle: `Profile - ${req.user?.name}`,
                    endApi: 'api/user/project',
                    user: req.user,
                    projects
                })
        } catch (error) {
            console.log('renderUserProjects : ' + error.message)
        }
    },
    renderUserEducation: async (req, res) => {
        try {
            const pipeline = [
                { $match: { candidateId: req.user?._id } },
                {
                    $addFields: {
                        completedYear: {
                            $dateToString: { format: "%Y", date: "$endDate" }
                        }
                    }
                }
            ]
            return res.render('layout/site',
                {
                    body: '../site/candidate/dashboard',
                    profilelayout: './educations',
                    title: 'HireNest | Profile',
                    subtitle: `Profile - ${req.user?.name}`,
                    endApi: 'api/user/education',
                    user: req.user,
                    educations: await handleAggregatePagination(educationModel, pipeline, req.query)
                })
        } catch (error) {
            console.log('renderUserEducation : ' + error.message)
        }
    },
    renderUserExperience: async (req, res) => {
        try {
            const months = ["January", "February", "March", "April", "May"
                , "June", "July", "August", "September", "October", "November"
                , "December"]
            const pipeline = [
                { $match: { candidateId: req.user?._id } },
                { $sort: { startDate: -1 } },
                {
                    $addFields: {
                        startDay: { $dayOfMonth: "$startDate" },
                        startMonth: { $month: "$startDate" },
                        startYear: { $year: "$startDate" },
                        endDay: { $dayOfMonth: "$endDate" },
                        endMonth: { $month: "$endDate" },
                        endYear: { $year: "$endDate" }
                    }
                },
                {
                    $addFields: {
                        startDate: {
                            $concat: [
                                { $toString: "$startDay" }, " ",
                                {
                                    $arrayElemAt: [months, "$startMonth"]
                                },
                                ", ",
                                { $toString: "$startYear" }
                            ]
                        },
                        endDate: {
                            $concat: [
                                { $toString: "$endDay" },
                                " ",
                                {
                                    $arrayElemAt: [months, "$endMonth"]
                                },
                                ", ",
                                { $toString: "$endYear" }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        companyName: 1,
                        position: 1,
                        startDate: 1,
                        endDate: 1,
                        stillworking: 1
                    }
                }
            ]

            return res.render('layout/site',
                {
                    body: '../site/candidate/dashboard',
                    profilelayout: './experiences',
                    title: 'HireNest | Profile',
                    subtitle: `Profile - ${req.user?.name}`,
                    endApi: 'api/user/experience',
                    user: req.user,
                    experiences: await handleAggregatePagination(experienceModel, pipeline, req.query)
                })
        } catch (error) {
            console.log('renderUserExperience : ' + error.message)
        }
    },
    renderRecuriterProfilePage: async (req, res) => {
        try {
            const country = req.user?.location.country;
            const state = req.user?.location.state;
            const city = req.user?.location.city;
            return res.render('layout/site',
                {
                    body: '../site/recuriter/dashboard',
                    profilelayout: './userProfile',
                    title: `Profile - ${req.user?.companyName}`,
                    user: req.user,
                    endApi: 'api/recruiter',
                    country: Country.getCountryByCode(country),
                    state: State.getStateByCodeAndCountry(state, country),
                    city: City.getCitiesOfState(country, state).filter(c => c.name === city)[0]
                })
        } catch (error) {
            console.log('renderRecuriterProfilePage : ' + error.message)
        }
    },
    renderRecuriterSettings: async (req, res) => {
        try {
            return res.render('layout/site',
                {
                    body: '../site/recuriter/dashboard',
                    profilelayout: './settings',
                    title: `Profile - ${req.user?.companyName}`,
                    user: req.user,
                    endApi: 'api/recruiter',
                })
        } catch (error) {
            console.log('renderRecuriterSettings : ' + error.message)
        }
    },
    renderRecuriterDashBoard: async (req, res) => {
        try {

            return res.render('layout/site',
                {
                    body: '../site/recuriter/dashboard',
                    profilelayout: './dashboardoptions',
                    title: `Profile - ${req.user?.companyName}`,
                    user: req.user,
                    // endApi: 'api/recruiter',
                })
        } catch (error) {
            console.log('renderRecuriterDashBoard : ' + error.message)
        }
    },
    renderJobsPage: async (req, res) => {
        try {
            const months = ["January", "February", "March", "April", "May"
                , "June", "July", "August", "September", "October", "November"
                , "December"]

            const pipeline = [
                {
                    $match: { recuriterId: req.user?._id }
                },
                {
                    $addFields: {
                        endDay: { $dayOfMonth: "$expireDate" },
                        endMonth: { $month: "$expireDate" },
                        endYear: { $year: "$expireDate" }
                    }
                },
                {
                    $addFields: {
                        expireDate: {
                            $concat: [
                                { $toString: "$endDay" },
                                " ",
                                {
                                    $arrayElemAt: [months, "$endMonth"]
                                },
                                ", ",
                                { $toString: "$endYear" }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        status: 1,
                        expireDate: 1,
                        jobTitle: 1,
                    }
                }
            ]
            const jobs = await handleAggregatePagination(jobModel, pipeline, req.query)
            return res.render('layout/site',
                {
                    body: '../site/recuriter/dashboard',
                    profilelayout: './jobs',
                    title: `Profile - ${req.user?.companyName}`,
                    user: req.user,
                    jobs
                })
        } catch (error) {
            console.log('renderJobsPage : ' + error.message)
        }
    },
    renderAddJobPage: async (req, res) => {
        try {
            const country = req.user?.location.country;
            const state = req.user?.location.state;
            const city = req.user?.location.city;

            const [jobtypes, jobtindustries] = await Promise.all([
                jobTypeModel.find({ status: true }),
                jobIndustryTypeModel.find({ status: true })
            ])

            return res.render('layout/site',
                {
                    body: '../site/recuriter/dashboard',
                    profilelayout: './createJob',
                    title: `Profile - ${req.user?.companyName}`,
                    user: req.user,
                    jobtypes,
                    jobtindustries,
                    endApi: 'api/recruiter/create-job',
                    country: Country.getCountryByCode(country),
                    state: State.getStateByCodeAndCountry(state, country),
                    city: City.getCitiesOfState(country, state).filter(c => c.name === city)[0]
                })
        } catch (error) {
            console.log('renderAddJobPage : ' + error.message)
        }
    },
    renderUpdateJobPage: async (req, res) => {
        try {
            const country = req.user?.location.country;
            const state = req.user?.location.state;
            const city = req.user?.location.city;
            const pipeline = [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(req.params.id),
                        recuriterId: req.user?._id
                    }
                },
                {
                    $lookup: {
                        from: 'job_categories',
                        localField: 'categoryId',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $unwind: '$category'
                },
                {
                    $lookup: {
                        from: 'jobindustrytypes',
                        localField: 'industryId',
                        foreignField: '_id',
                        as: 'industry'
                    }
                },
                {
                    $unwind: '$jobindustry'
                },
                {
                    $lookup: {
                        from: 'degrees',
                        localField: 'degreeId',
                        foreignField: '_id',
                        as: 'degree'
                    }
                },
                {
                    $unwind: '$degree'
                },
                {
                    $lookup: {
                        from: 'jobtypes',
                        localField: 'jobTypeId',
                        foreignField: '_id',
                        as: 'jobTypes'
                    }
                },
                {
                    $lookup: {
                        from: 'jobskills',
                        localField: 'skills',
                        foreignField: '_id',
                        as: 'skills'
                    }
                },
                {
                    $lookup: {
                        from: 'jobtags',
                        localField: 'tags',
                        foreignField: '_id',
                        as: 'tags'
                    }
                },
            ]

            const [jobtypes, jobtindustries, job] = await Promise.all([
                jobTypeModel.find({ status: true }),
                jobIndustryTypeModel.find({ status: true }),
                jobModel.aggregate(pipeline)
            ])
            console.log(job);

            return res.render('layout/site',
                {
                    body: '../site/recuriter/dashboard',
                    profilelayout: './createJob',
                    title: `Profile - ${req.user?.companyName}`,
                    user: req.user,
                    jobtypes,
                    jobtindustries,
                    job,
                    endApi: 'api/recruiter/create-job',
                    country: Country.getCountryByCode(country),
                    state: State.getStateByCodeAndCountry(state, country),
                    city: City.getCitiesOfState(country, state).filter(c => c.name === city)[0]
                })
        } catch (error) {
            console.log('renderUpdateJobPage : ' + error.message)
        }
    },
}

export default siteControllers