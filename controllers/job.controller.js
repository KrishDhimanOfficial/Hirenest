import mongoose from "mongoose";
import validate from "../services/validate.js";
import jobModel from "../models/job.model.js";
import { parseISO } from "date-fns";
import userModel from "../models/user.model.js";
const validateId = mongoose.Types.ObjectId.isValid;
const ObjectId = mongoose.Types.ObjectId;

const jobControllers = {
    createJob: async (req, res) => {
        try {
            const { jobTitle, industryId, categoryId, jobTypeId, skills, tags, country, state, city,
                salary, hideSalary, salaryRange, experience, degreeId, postDate, expireDate,
                shortDesc, desc, status, openings
            } = req.body;

            if (!Array.isArray(tags) || !Array.isArray(jobTypeId) || !Array.isArray(skills)) {
                return res.status(404).json({ error: 'Please Select Multiple Options.' })
            }
            const docToBeSave = {
                jobTitle, openings,
                recuriterId: req.user?._id,
                categoryId: new ObjectId(categoryId),
                industryId: new ObjectId(industryId),
                jobTypeId: jobTypeId?.map(id => new ObjectId(id)),
                degreeId: new ObjectId(degreeId),
                skills: skills?.map(id => new ObjectId(id)),
                tags: tags?.map(id => new ObjectId(id)),
                shortDesc, desc, status: status === 'true' ? true : false,
                salaryRange, experience: parseInt(experience),
                postDate: parseISO(postDate),
                expireDate: parseISO(expireDate)

            }
            const salaryreq = salary.replaceAll('$', ' ')

            if (hideSalary == 'on') docToBeSave.hideSalary = true;
            else docToBeSave.salary = { min: parseInt(salaryreq.split('-')[0]), max: parseInt(salaryreq.split('-')[1]) }

            const response = await jobModel.create(docToBeSave)

            if (!response) return res.status(404).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ redirect: '/recruiter/profile/jobs' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createJob : ' + error.message)
        }
    },
    updateJob: async (req, res) => {
        try {
            const { jobTitle, industryId, categoryId, jobTypeId, skills, tags, country, state, city,
                salary, hideSalary, salaryRange, experience, degreeId, postDate, expireDate,
                shortDesc, desc, status, openings
            } = req.body;
            console.log(req.body);

            if (!Array.isArray(tags) || !Array.isArray(jobTypeId) || !Array.isArray(skills)) {
                return res.status(404).json({ error: 'Please Select Multiple Options.' })
            }
            const docToBeSave = {
                jobTitle, openings,
                recuriterId: req.user?._id,
                categoryId: new ObjectId(categoryId),
                industryId: new ObjectId(industryId),
                jobTypeId: jobTypeId?.map(id => new ObjectId(id)),
                degreeId: new ObjectId(degreeId),
                skills: skills?.map(id => new ObjectId(id)),
                tags: tags?.map(id => new ObjectId(id)),
                shortDesc, desc, status: status === 'true' ? true : false,
                salaryRange, experience: parseInt(experience),
                postDate: parseISO(postDate),
                expireDate: parseISO(expireDate)

            }
            const salaryreq = salary.replaceAll('$', ' ')

            if (hideSalary == 'on') docToBeSave.hideSalary = true;
            else docToBeSave.salary = { min: parseInt(salaryreq.split('-')[0]), max: parseInt(salaryreq.split('-')[1]) }

            const response = await jobModel.findByIdAndUpdate({ _id: req.params.id }, docToBeSave, { runValidators: true })

            if (!response) return res.status(404).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ redirect: '/recruiter/profile/jobs' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('  updateJob : ' + error.message)
        }
    },
    deleteJob: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Select Category Industry.' })

            const response = await jobModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.status(404).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'Deleted.' })
        } catch (error) {
            console.log('deleteJob : ' + error.message)
        }
    },
    updateSavedJobs: async (req, res) => {
        try {
            if (req.user?.isrecuiter) return null;
            if (!req.user) return res.status(400).redirect('/login')
            if (!validateId(req.params.id)) {
                req.session.error = 'Something went wrong! Please try again later.'
                return res.status(400).redirect('/find/jobs')
            }

            const response = await userModel.findByIdAndUpdate({ _id: req.user?._id },
                { $addToSet: { savedJobs: [new ObjectId(req.params.id)] } }
            )

            if (!response) {
                req.session.error = 'Something went wrong! Please try again later.'
                return res.status(400).redirect('/find/jobs')
            }
            req.session.success = 'Added to saved List.'
            return res.status(200).redirect('/find/jobs')
        } catch (error) {
            console.log('updateSavedJobs : ' + error.message)
        }
    },
    renderSearchDetails: async (req, res) => {
        try {
            return res.render('layout/site',
                {
                    body: '../site/jobDetails',
                    title: `Job Details - ${req.params.job}`,
                    user: req.user,
                }
            )
        } catch (error) {
            console.log('renderSearchDetails : ' + error.message)
        }
    },
}

export default jobControllers