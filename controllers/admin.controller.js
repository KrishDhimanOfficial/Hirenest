import jobCategoryModel from "../models/job.category.model.js"
import jobDegreeModel from "../models/job.degree.model.js";
import jobIndustryTypeModel from "../models/job.industry.type.model.js";
import jobTagModel from "../models/job.tag.model.js";
import jobTypeModel from "../models/job.type.model.js";
import userModel from "../models/user.model.js";
import handleAggregatePagination from "../services/handlepagePagination.js"

const adminControllers = {
    renderDashboard: async (req, res) => {
        try {
            return res.render('admin/dashboard',
                {
                    layout: 'layout/admin',
                    title: 'Dashboard'
                }
            )
        } catch (error) {
            console.log('renderDashboard : ' + error.message)
        }
    },
    renderJobDegree: async (req, res) => {
        try {
            const response = await jobDegreeModel.find({})
            return res.render('admin/jobdegree/degree',
                {
                    layout: 'layout/admin',
                    title: 'Dashboard',
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
            const response = await jobCategoryModel.find({})
            return res.render('admin/jobcategory/category',
                {
                    layout: 'layout/admin',
                    title: 'Dashboard',
                    categories: response,
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
            return res.render('admin/jobindustry/industry',
                {
                    layout: 'layout/admin',
                    title: 'Dashboard',
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
            return res.render('admin/jobtags/tags',
                {
                    layout: 'layout/admin',
                    title: 'Dashboard',
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
            return res.render('admin/jobtypes/jobtypes',
                {
                    layout: 'layout/admin',
                    title: 'Dashboard',
                    jobtypes: response,
                    endApi: 'dashboard/job-type'
                }
            )
        } catch (error) {
            console.log('renderJobType : ' + error.message)
        }
    },
}

export default adminControllers