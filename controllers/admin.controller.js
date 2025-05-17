import jobCategoryModel from "../models/job.category.model.js"
import jobDegreeModel from "../models/job.degree.model.js";
import jobIndustryTypeModel from "../models/job.industry.type.model.js";
import jobTagModel from "../models/job.tag.model.js";
import jobTypeModel from "../models/job.type.model.js";
import skillModel from "../models/skill.model.js";
import userModel from "../models/user.model.js";
import site_settingsModel from "../models/site_settings.model.js";
import handleAggregatePagination from "../services/handlepagePagination.js"
import deleteFile from "../services/deleteFile.js";
import jobModel from "../models/job.model.js";
import { Country, State } from "country-state-city";

const adminControllers = {
    renderDashboard: async (req, res) => {
        try {

            const [totalJobs, totalrecuriters, totalcandidates, totalusers, totalSignups] = await Promise.all([
                jobModel.countDocuments({ status: true }),
                userModel.countDocuments({ isrecuiter: true, isactive: true }),
                userModel.countDocuments({ isrecuiter: false, isactive: true }),
                userModel.countDocuments({ role: { $ne: 'admin' } }),
                userModel.aggregate([
                    { $match: { role: { $ne: 'admin' } } },
                    {
                        $group: {
                            _id: {
                                year: { $year: "$createdAt" },
                                month: { $month: "$createdAt" }
                            },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort: {
                            "_id.year": -1,
                            "_id.month": -1
                        }
                    }
                ])
            ])
            console.log(totalSignups);


            return res.render('layout/admin', {
                title: 'Hirenest | Dashboard',
                body: '../admin/dashboard',
                totalJobs, totalrecuriters,
                totalcandidates, totalusers,
                totalSignups: JSON.stringify(totalSignups)
            })
        } catch (error) {
            console.log('renderDashboard : ' + error.message)
        }
    },
    renderJobDegree: async (req, res) => {
        try {
            const response = await jobDegreeModel.find({})
            return res.render('layout/admin',
                {
                    body: '../admin/jobdegree/degree',
                    title: 'Hirenest | Dashboard',
                    degrees: response,
                    endApi: 'dashboard/job-degree'
                }
            )
        } catch (error) {
            console.log('renderJobDegree : ' + error.message)
        }
    },
    renderJobCategory: async (req, res) => {
        try {
            const [response1, response2] = await Promise.all([
                jobCategoryModel.find({}),
                jobIndustryTypeModel.find({ status: true })
            ])

            return res.render('layout/admin',
                {
                    body: '../admin/jobcategory/category',
                    title: 'Hirenest | Dashboard',
                    categories: response1,
                    jobIndustries: response2,
                    endApi: 'dashboard/job-category'
                }
            )
        } catch (error) {
            console.log('renderJobCategory : ' + error.message)
        }
    },
    renderJobIndustry: async (req, res) => {
        try {
            const response = await jobIndustryTypeModel.find({})
            return res.render('layout/admin',
                {
                    body: '../admin/jobindustry/industry',
                    title: 'Hirenest | Dashboard',
                    industries: response,
                    endApi: 'dashboard/job-industry'
                }
            )
        } catch (error) {

            console.log('renderJobIndustry : ' + error.message)
        }
    },
    renderJobTag: async (req, res) => {
        try {
            const response = await jobTagModel.find({})
            return res.render('layout/admin',
                {
                    body: '../admin/jobtags/tags',
                    title: 'Hirenest | Dashboard',
                    tags: response,
                    endApi: 'dashboard/job-tag'
                }
            )
        } catch (error) {
            console.log('renderJobTag : ' + error.message)
        }
    },
    renderJobType: async (req, res) => {
        try {
            const response = await jobTypeModel.find({})
            return res.render('layout/admin',
                {
                    body: '../admin/jobtypes/jobtypes',
                    title: 'Dashboard | JobType',
                    jobtypes: response,
                    endApi: 'dashboard/job-type'
                }
            )
        } catch (error) {
            console.log('renderJobType : ' + error.message)
        }
    },
    renderTerms_CondtionPage: async (req, res) => {
        try {
            const settings = await site_settingsModel.find({}, { term_condition: 1 })

            return res.render('layout/admin',
                {
                    body: '../admin/settings/siteTerms',
                    title: 'Dashboard | Term',
                    settings: settings[0]
                }
            )
        } catch (error) {
            console.log('renderTerms_CondtionPage : ' + error.message)
        }
    },
    setSiteTerms: async (req, res) => {
        try {
            const { term_condition } = req.body;
            const response = await site_settingsModel.findByIdAndUpdate({ _id: '6821d1a9b57e33e4ce6ef864' }, { term_condition: term_condition.trim() })
            if (!response) res.status(400).redirect('/dashboard/setting/term&condition')
            return res.status(200).redirect('/dashboard/setting/term&condition')
        } catch (error) {
            console.log('setSiteTerms : ' + error.message)
        }
    },
    renderUsers: async (req, res) => {
        try {
            const response = await userModel.find({ role: { $ne: 'admin' } },
                {
                    _id: 1,
                    name: 1,
                    isactive: 1,
                    email: 1,
                    isrecuiter: 1
                }
            )

            return res.render('layout/admin',
                {
                    body: '../admin/users/users',
                    title: 'Dashboard | Users',
                    users: response,
                    endApi: 'dashboard/user'
                }
            )
        } catch (error) {
            console.log('renderUsers : ' + error.message)
        }
    },
    renderJobSkills: async (req, res) => {
        try {
            const response = await skillModel.find({})
            return res.render('layout/admin',
                {
                    body: '../admin/jobskills/skills',
                    title: 'Dashboard | Job Skills',
                    skills: response,
                    endApi: 'dashboard/job-skill'
                }
            )
        } catch (error) {
            console.log('renderJobSkills : ' + error.message)
        }
    },
    renderGeneralSettings: async (req, res) => {
        try {
            const settings = await site_settingsModel.find({}, { companyname: 1, companyemail: 1, contact: 1 })

            const error = req.session.error;
            delete req.session.error;
            return res.render('layout/admin',
                {
                    body: '../admin/settings/site_setting',
                    title: 'Dashboard | Term',
                    settings: settings[0],
                    error
                }
            )
        } catch (error) {
            console.log('renderGeneralSettings : ' + error.message)
        }
    },
    setGeneralSettings: async (req, res) => {
        try {
            const { companyname, companyemail, contact, } = req.body;

            if (!companyname || !companyemail || !contact) {
                req.session.error = 'All fields are required'
                return res.status(400).redirect('/dashboard/setting/general-settings')
            }
            const response = await site_settingsModel.findByIdAndUpdate({ _id: '6821d1a9b57e33e4ce6ef864' }, { companyname, companyemail, contact, logo: req.file.filename })
            if (req.file.filename) deleteFile(`companylogo/${response.logo}`)
            if (!response) {
                req.session.error = 'Something went wrong! Please try again later.'
                return res.status(400).redirect('/dashboard/setting/general-settings')
            }
            return res.status(200).redirect('/dashboard/setting/general-settings')
        } catch (error) {
            if (error.name === 'ValidationError') {
                req.session.error = 'Check Input Fields.'
                return res.status(400).redirect('/dashboard/setting/general-settings')
            }
            console.log('setGeneralSettings : ' + error.message)
        }
    },
    getGeneralSettings: async (req, res) => {
        try {
            const settings = await site_settingsModel.find({}, { companyname: 1, companyemail: 1, contact: 1, logo: 1 })
            return res.status(200).json(settings[0])
        } catch (error) {
            console.log('getGeneralSettings : ' + error.message)
        }
    },
    renderAboutusSetting: async (req, res) => {
        try {
            const settings = await site_settingsModel.find({}, { aboutTitle: 1, desc: 1, chooseus_title: 1, chooseus_desc: 1 })

            const error = req.session.error;
            delete req.session.error;
            return res.render('layout/admin',
                {
                    body: '../admin/aboutus/aboutus',
                    title: 'Dashboard | About us',
                    error, settings: settings[0],
                }
            )
        } catch (error) {
            console.log('renderAboutusSetting : ' + error.message)
        }
    },
    setAboutSettings: async (req, res) => {
        try {
            const { aboutTitle, desc, chooseus_title, chooseus_desc } = req.body;

            if (!aboutTitle || !desc || !chooseus_title || !chooseus_desc) {
                req.session.error = 'All fields are required'
                return res.status(400).redirect('/dashboard/aboutus')
            }
            const response = await site_settingsModel.findByIdAndUpdate({ _id: '6821d1a9b57e33e4ce6ef864' }, { aboutTitle, desc, chooseus_title, chooseus_desc })

            if (!response) {
                req.session.error = 'Something went wrong! Please try again later.'
                return res.status(400).redirect('/dashboard/aboutus')
            }
            return res.status(200).redirect('/dashboard/aboutus')
        } catch (error) {
            if (error.name === 'ValidationError') {
                req.session.error = 'Check Input Fields.'
                return res.status(400).redirect('/dashboard/aboutus')
            }
            console.log('setAboutSettings : ' + error.message)
        }
    },
    renderJobApproval: async (req, res) => {
        try {
            const jobs = await jobModel.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'recuriterId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: true
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
                    $unwind: {
                        path: '$category',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        jobTitle: 1,
                        'category.name': 1,
                        'user.companyName': 1,
                        'user.location': 1,
                        approved: 1
                    }
                }
            ])

            return res.render('layout/admin',
                {
                    body: '../admin/jobs/sitejobs',
                    title: 'Dashboard | Job Approval',
                    endApi: 'dashboard/job-approval',
                    jobs, getState: State.getStateByCodeAndCountry,
                    getCountry: Country.getCountryByCode
                }
            )
        } catch (error) {
            console.log('renderJobApproval : ' + error.message)
            return res.status(500).render('layout/admin', {
                body: '../admin/error',
                title: 'Error',
                error: 'An error occurred while fetching job approvals'
            })
        }
    },
}

export default adminControllers