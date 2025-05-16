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

const ObjectId = mongoose.Types.ObjectId;

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
            const [totalJobs, totalrecuriters] = await Promise.all([
                jobModel.countDocuments({ status: true }),
                userModel.countDocuments({ isrecuiter: true })
            ])

            return res.render('layout/site',
                {
                    body: '../site/home',
                    title: 'Home',
                    user: req.user,
                    totalJobs, totalrecuriters
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
                    user: req.user,
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
            const degrees = await jobDegreeModel.find({ status: true })

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
                    skills, degrees,
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
    renderSavedJobList: async (req, res) => {
        try {
            const pipeline = [
                {
                    $match: { _id: req.user?._id }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        localField: 'savedJobs',
                        foreignField: '_id',
                        as: 'savedJobs'
                    }
                },
                {
                    $unwind: {
                        path: '$savedJobs',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $replaceRoot: { newRoot: '$savedJobs' }
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
                        from: 'users',
                        localField: 'recuriterId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $addFields: {
                        state: '$user.location.state',
                        country: '$user.location.country',
                        companylogo: '$user.image'
                    }
                },
                {
                    $project: {
                        jobTitle: 1,
                        'category.name': 1,
                        state: 1,
                        country: 1,
                        experience: 1,
                        hideSalary: 1,
                        salary: 1,
                        companylogo: 1,
                        shortDesc: 1
                    }
                }
            ]
            const jobs = await handleAggregatePagination(userModel, pipeline, req.query)
            console.log(jobs);

            return res.render('layout/site',
                {
                    body: '../site/candidate/dashboard',
                    profilelayout: './savedJobs',
                    title: 'HireNest | Profile',
                    subtitle: `Profile - ${req.user?.name}`,
                    user: req.user,
                    jobs,
                    getState: State.getStateByCodeAndCountry
                }
            )
        } catch (error) {
            console.log('renderSavedJobList : ' + error.message)
        }
    },
    renderAppliedJobList: async (req, res) => {
        try {
            const pipeline = [
                {
                    $match: { _id: req.user?._id }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        localField: 'appliedJobs',
                        foreignField: '_id',
                        as: 'appliedJobs'
                    }
                },
                {
                    $unwind: {
                        path: '$appliedJobs',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $replaceRoot: { newRoot: '$appliedJobs' }
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
                    $unwind: {
                        path: '$category',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'recuriterId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $addFields: {
                        state: '$user.location.state',
                        country: '$user.location.country',
                        companylogo: '$user.image'
                    }
                },
                {
                    $project: {
                        jobTitle: 1,
                        'category.name': 1,
                        state: 1,
                        country: 1,
                        experience: 1,
                        hideSalary: 1,
                        salary: 1,
                        companylogo: 1,
                        shortDesc: 1
                    }
                }
            ]
            const jobs = await handleAggregatePagination(userModel, pipeline, req.query)

            return res.render('layout/site',
                {
                    body: '../site/candidate/dashboard',
                    profilelayout: './appliedJobs',
                    title: 'HireNest | Profile',
                    subtitle: `Profile - ${req.user?.name}`,
                    user: req.user,
                    jobs,
                    getState: State.getStateByCodeAndCountry
                }
            )
        } catch (error) {

            console.log('renderAppliedJobList : ' + error.message)
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
                })
        } catch (error) {
            console.log('renderRecuriterDashBoard : ' + error.message)
        }
    },
    renderFilterCandidates: async (req, res) => {
        try {
            const error = req.session.error;
            delete req.session.error;

            return res.render('layout/site',
                {
                    body: '../site/recuriter/filterCandidate',
                    profilelayout: '',
                    title: `Profile - ${req.user?.companyName}`,
                    user: req.user, error,
                    endApi: `api/filter/applied-job/candidate/${req.params.jobId}`,
                })
        } catch (error) {
            console.log('renderFilterCandidates : ' + error.message)
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
                    jobs,
                    endApi: 'api/recruiter/create-job',
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
                        _id: new ObjectId(req.params.id),
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

            return res.render('layout/site',
                {
                    body: '../site/recuriter/dashboard',
                    profilelayout: './updateJob',
                    title: `Profile - ${req.user?.companyName}`,
                    user: req.user,
                    jobtypes,
                    jobtindustries,
                    job: job[0],
                    endApi: 'api/recruiter/create-job',
                    country: Country.getCountryByCode(country),
                    state: State.getStateByCodeAndCountry(state, country),
                    city: City.getCitiesOfState(country, state).filter(c => c.name === city)[0]
                })
        } catch (error) {
            console.log('renderUpdateJobPage : ' + error.message)
        }
    },
    renderSearchJobPage: async (req, res) => {
        try {
            const { latest, search, experience, skill } = req.query;
            // console.log('renderSearchJobPage - queryparams :', req.query);

            const educationsPipeline = [
                { $lookup: { from: 'jobs', localField: '_id', foreignField: 'degreeId', as: 'degree' } },
                { $project: { 'degree._id': 1, name: 1 } },
                { $addFields: { count: { $size: '$degree' } } },
                { $project: { name: 1, count: 1 } }
            ]

            const matchParameters = {
                jobTitle: { $regex: search || '', $options: 'i' },
                status: true
            }

            if (experience) match.experience = { $lte: parseInt(experience) }
            if (skill) {
                const skillId = await skillModel.findOne({ name: { $regex: skill, $options: 'i' } })
                matchParameters.skills = { $in: [skillId?._id] }
            }

            const pipeline = [
                { $match: matchParameters },
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
                        from: 'users',
                        localField: 'recuriterId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                {
                    $match: {
                        'user.isactive': true,
                        'user.isrecuiter': true
                    }
                },
                {
                    $addFields: {
                        state: '$user.location.state',
                        country: '$user.location.country',
                        companylogo: '$user.image',
                        companyName: '$user.companyName'
                    }
                },
                {
                    $project: {
                        jobTitle: 1,
                        'category.name': 1,
                        state: 1,
                        country: 1,
                        experience: 1,
                        hideSalary: 1,
                        salary: 1,
                        companylogo: 1,
                        shortDesc: 1,
                        companyName: 1
                    }
                }
            ]
            if (latest) pipeline.push({ $sort: { postDate: 1 } })

            const [jobs, educations] = await Promise.all([
                handleAggregatePagination(jobModel, pipeline, req.query),
                jobDegreeModel.aggregate(educationsPipeline)
            ])

            const error = req.session.error;
            const success = req.session.success;

            delete req.session.error
            delete req.session.success
            return res.render('layout/site',
                {
                    body: '../site/jobsSearch',
                    title: 'Home - Search Jobs',
                    user: req.user, jobs, error, success,
                    query: req.query,
                    getState: State.getStateByCodeAndCountry
                }
            )
        } catch (error) {
            console.log('renderSearchJobPage : ' + error.message)
        }
    },
}

export default siteControllers