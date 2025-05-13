import mongoose from "mongoose";
import validate from "../services/validate.js";
import jobModel from "../models/job.model.js";
import { parseISO } from "date-fns";
const validateId = mongoose.Types.ObjectId.isValid;
const ObjectId = mongoose.Types.ObjectId;

const jobControllers = {
    createJob: async (req, res) => {
        try {
            const { jobTitle, industryId, categoryId, jobTypeId, skills, tags, country, state, city,
                salary, hideSalary, salaryRange, experience, degreeId, postDate, expireDate,
                shortDesc, desc, status,
            } = req.body;

            if (!Array.isArray(tags) || !Array.isArray(jobTypeId) || !Array.isArray(skills)) {
                return res.status(404).json({ error: 'Please Select Multiple Options.' })
            }
            const docToBeSave = {
                jobTitle,
                recuriterId: req.user?._id,
                categoryId: new ObjectId(categoryId),
                industryId: new ObjectId(industryId),
                jobTypeId: jobTypeId?.map(id => new ObjectId(id)),
                degreeId: new ObjectId(degreeId),
                skills: skills?.map(id => new ObjectId(id)),
                tags: tags?.map(id => new ObjectId(id)),
                shortDesc, desc, status: status === 'true' ? true : false,
                salaryRange, experience: {
                    min: parseInt(experience.split('-')[0]),
                    max: parseInt(experience.split('-')[1])
                },
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
                shortDesc, desc, status,
            } = req.body;

            if (!Array.isArray(tags) || !Array.isArray(jobTypeId) || !Array.isArray(skills)) {
                return res.status(404).json({ error: 'Please Select Multiple Options.' })
            }
            const docToBeSave = {
                jobTitle,
                recuriterId: req.user?._id,
                categoryId: new ObjectId(categoryId),
                industryId: new ObjectId(industryId),
                jobTypeId: jobTypeId?.map(id => new ObjectId(id)),
                degreeId: new ObjectId(degreeId),
                skills: skills?.map(id => new ObjectId(id)),
                tags: tags?.map(id => new ObjectId(id)),
                shortDesc, desc, status: status === 'true' ? true : false,
                salaryRange, experience: {
                    min: parseInt(experience.split('-')[0]),
                    max: parseInt(experience.split('-')[1])
                },
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
            console.log('  updateJob : ' + error.message)
        }
    },
    deleteJob: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Select Category Industry.' })

            const response = await jobModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.json({ error: 'Something went wrong, please try again later.' })
            return res.json({ success: 'Deleted.' })
        } catch (error) {
            console.log('deleteJob : ' + error.message)
        }
    },
}

export default jobControllers