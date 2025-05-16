import userModel from "../models/user.model.js"
import bcrypt from 'bcrypt'
import { parseISO } from 'date-fns'
import validate from "../services/validate.js"
import userProjectModel from "../models/user.project.model.js"
import mongoose from "mongoose";
import deleteFile from '../services/deleteFile.js'
import ZipFile from "../services/ZipFile.js";
import experienceModel from "../models/experience.model.js";
import educationModel from "../models/education.model.js"
import path from 'path'
import config from "../config/config.js"
const ObjectId = mongoose.Types.ObjectId;
const validateId = mongoose.Types.ObjectId.isValid;

const usersControllers = {
    createUser: async (req, res) => {
        try {
            const { name, email, password, confirmpassword, phone, isrecuiter, term_condition } = req.body;
            if (password !== confirmpassword) return res.status(400).json({ error: "Password dosen't Match." })

            const checkFields = !name || !email || !password || !phone;
            if (checkFields) return res.status(400).json({ info: "All Fields Required." })
            if (!term_condition) return res.status(400).json({ info: "Read Term & Condition." })

            const checkExstence = await userModel.findOne({ email })
            if (checkExstence) return res.status(400).json({ error: "Email is already in use." })

            const response = await userModel.create({
                name, email, phone,
                password: await bcrypt.hash(password, 10),
                isrecuiter: isrecuiter ? true : false
            })
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ redirect: '/login' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createUser : ' + error.message)
        }
    },
    getuserInfo: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await userModel.findById({ _id: req.params.id })
            if (!response) return res.status(404).json({ error: 'Not Found.' })
            return res.status(200).json(response)
        } catch (error) {
            console.log('getuserInfo : ' + error.message)
        }
    },
    updateuserInfo: async (req, res) => {
        try {
            const { name, phone, gender, address, skills, country, state, degreeId, city, bio, url } = req.body;

            if (skills.length > 10) return res.status(400).json({ info: "Skills can't be more than 10" })
            if (!name || !phone || !gender || !address || !country || !state || !city || !bio || !url) {
                deleteFile(`userInfo/${req.files['image'][0].filename}`)
                deleteFile(`userInfo/${req.files['resume'][0].filename}`)
                return res.status(400).json({ info: "All Fields Required." })
            }

            const docToBeupdate = {
                name, phone, gender,
                location: { address, country, state, city },
                bio, url,
                degreeId: new ObjectId(degreeId)
            }

            if (req.files['image']) docToBeupdate.image = req.files['image'][0].filename
            if (req.files['resume']) docToBeupdate.resume = req.files['resume'][0].filename.replace('.pdf', '.zip')
            if (skills) docToBeupdate.skills = skills.map(id => new ObjectId(id))

            const response = await userModel.findByIdAndUpdate(
                { _id: req.user?._id },
                docToBeupdate,
                { runValidators: true }
            )

            if (!response) return res.status(404).json({ error: 'Something went wrong, please try again later.' })

            if (req.files['image']) await deleteFile(`userInfo/${response.image}`)
            if (req.files['resume']) await deleteFile(`userInfo/${response.resume}`)
            ZipFile(req, res) // Zip the pdf file

            return res.status(200).json({ redirect: `/profile/${req.user?.name}` })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            if (req.files['image']) deleteFile(`userInfo/${req.files['image'][0].filename}`)
            if (req.files['resume']) deleteFile(`userInfo/${req.files['resume'][0].filename}`)
            console.log('updateuserInfo : ' + error.message)
            return res.status(500).json({ error: 'Something went wrong, please try again later.' })
        }
    },
    updateUserPassword: async (req, res) => {
        try {
            const { password, confirm_password } = req.body;
            if (password !== confirm_password) return res.status(400).json({ error: 'Passwords do not match.' })

            const response = await userModel.findByIdAndUpdate(
                { _id: req.user?._id },
                { password: await bcrypt.hash(password, 10) },
                { new: true }
            )
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'Password Changed.' })
        } catch (error) {
            console.log('updateUserPassword : ' + error.message)
        }
    },
    updateUserActiveStatus: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })
            const { status } = req.body;

            const response = await userModel.findByIdAndUpdate({ _id: req.params.id }, { isactive: status })
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated successfully.' })
        } catch (error) {
            console.log('updateUserActiveStatus : ' + error.message)
        }
    },
    deleteuserInfo: async (req, res) => {
        try {
            const response = await userModel.findByIdAndDelete({ _id: req.user?._id }, { new: true })
            if (!response) return res.status(404).json({ error: 'Not Found.' })

            await deleteFile(`userInfo/${response.image}`)
            await deleteFile(`userInfo/${response.resume}`)
            return res.status(200).json({ redirect: '/login' })
        } catch (error) {
            console.log('deleteuserInfo : ' + error.message)
        }
    },
    createUserProject: async (req, res) => {
        try {

            const { name, desc, startmonth, startyear, endmonth, endyear, url, skills } = req.body;
            if (typeof skills === 'string') return res.status(400).json({ info: 'Select 2-3 Project Skills' })

            const response = await userProjectModel.create({
                candidateId: req.user?._id,
                name, desc, url,
                skills: skills?.map(id => new ObjectId(id)),
                project_duration: {
                    start: {
                        month: startmonth,
                        year: startyear
                    },
                    end: {
                        month: endmonth,
                        year: endyear
                    }
                },
            })

            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'Item created successfully.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createUserProject : ' + error.message)
        }
    },
    get_userProject: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await userProjectModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(req.params.id),
                        candidateId: req.user?._id
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
            ])
            if (!response) return res.status(404).json({ error: 'Not Found.' })
            return res.status(200).json(response[0])
        } catch (error) {
            console.log('get_userProject : ' + error.message)
        }
    },
    update_userProject: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const { name, desc, startmonth, startyear, endmonth, endyear, url, skills } = req.body;
            if (typeof skills === 'string') return res.status(400).json({ info: 'Select 2-3 Project Skills' })

            const response = await userProjectModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    candidateId: req.user?._id,
                    name, desc, url,
                    skills: skills?.map(id => new ObjectId(id)),
                    project_duration: {
                        start: {
                            month: startmonth,
                            year: startyear
                        },
                        end: {
                            month: endmonth,
                            year: endyear
                        }
                    },
                },
                { new: true, runValidators: true }
            )
            if (!response) return res.status(404).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('update_userProject : ' + error.message)
        }
    },
    delete_userProject: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })
            const response = await userProjectModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.status(404).json({ error: 'Not Found.' })
            return res.status(200).json({ redirect: `/profile/${req.user?.name}/projects` })
        } catch (error) {
            console.log('delete_userProject : ' + error.message)
        }
    },
    createuserExperience: async (req, res) => {
        try {
            const { companyName, position, startDate, endDate, stillworking, description } = req.body;

            const checkExstence = await experienceModel.findOne({ companyName, position })
            if (checkExstence) return res.status(400).json({ error: `Enter Record Exists.` })

            const docToBecreate = {
                candidateId: req.user?._id,
                companyName, position, description,
                startDate: parseISO(startDate),
            }

            stillworking == ''
                ? stillworking
                : docToBecreate.endDate = parseISO(endDate)

            const response = await experienceModel.create(docToBecreate)

            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ redirect: `/profile/${req.user?.name}/experience` })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createuserExperience : ' + error.message)
        }
    },
    getuserExperience: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await experienceModel.findById({ _id: req.params.id })
            if (!response) return res.status(400).json({ error: 'Not Found' })
            return res.status(200).json(response)
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('getuserExperience : ' + error.message)
        }
    },
    updateuserExperience: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            let { companyName, position, startDate, endDate, stillworking, description } = req.body;
            const docToBeupdate = {
                stillworking,
                companyName, position, description,
                startDate: parseISO(startDate),
            }

            stillworking
                ? docToBeupdate.stillworking = true
                : docToBecreate.endDate = parseISO(endDate)

            const response = await experienceModel.findByIdAndUpdate(
                { _id: req.params.id },
                docToBeupdate,
                { new: true, runValidators: true })

            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ redirect: `/profile/${req.user?.name}/experience` })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateuserExperience : ' + error.message)
        }
    },
    deleteuserExperience: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await experienceModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ redirect: `/profile/${req.user?.name}/experience` })
        } catch (error) {
            console.log('deleteuserExperience : ' + error.message)
        }
    },
    createEducation: async (req, res) => {
        try {
            const { courseName, specializedField, schoolORUniversity, startDate, endDate, description } = req.body;

            const checkExstence = await educationModel.findOne({ courseName })
            if (checkExstence) return res.status(400).json({ warning: `Record with ${courseName} Exists.` })

            const response = await educationModel.create({
                candidateId: req.user?._id,
                courseName,
                specializedField, schoolORUniversity, description,
                startDate: parseISO(startDate),
                endDate: parseISO(endDate)
            })

            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ redirect: `/profile/${req.user?.name}/education` })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createEducation : ' + error.message)
        }
    },
    getSingleEducation: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await educationModel.findById({ _id: req.params.id })
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json(response)
        } catch (error) {
            console.log('getSingleEducation : ' + error.message)
        }
    },
    updateEducation: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })
            const response = await educationModel.findByIdAndUpdate({ _id: req.params.id },
                {
                    courseName,
                    specializedField, schoolORUniversity, description,
                    startDate: parseISO(startDate),
                    endDate: parseISO(endDate)
                },
                { new: true, runValidators: true })
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ redirect: `/profile/${req.user?.name}/education` })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateEducation : ' + error.message)
        }
    },
    deleteEducation: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await educationModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'Deleted successfully.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('deleteEducation : ' + error.message)
        }
    },
    updateRecruiterInfo: async (req, res) => {
        try {
            const { companyName, name, phone, address, country, state, city, bio, url } = req.body;

            if (!companyName || !name || !phone || !address || !country || !state || !city || !bio || !url) {
                await deleteFile(`logo/${req.file.filename}`)
                return res.status(400).json({ info: "All Fields Required." })
            }

            const docToBeupdate = {
                name, phone, companyName,
                location: { address, country, state, city },
                bio, url
            }
            if (req.file.filename) docToBeupdate.image = req.file.filename

            const response = await userModel.findByIdAndUpdate(
                { _id: req.user?._id },
                docToBeupdate,
                { runValidators: true }
            )
            if (!response) return res.json({ error: 'message!' })
            return res.json({ redirect: '/recruiter/profile' })
        } catch (error) {
            await deleteFile(`logo/${req.file.filename}`)
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateRecruiterInfo : ' + error.message)
        }
    },
    changeRecuriterPassword: async (req, res) => {
        try {
            const { password, confirm_password } = req.body;
            if (password !== confirm_password) return res.status(400).json({ error: 'Passwords do not match.' })

            const response = await userModel.findByIdAndUpdate(
                { _id: req.user?._id },
                { password: await bcrypt.hash(password, 10) },
                { new: true }
            )
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'Password Changed.' })
        } catch (error) {
            console.log('changeRecuriterPassword : ' + error.message)
        }
    },
    deleteRecuirterInfo: async (req, res) => {
        try {
            const response = await userModel.findByIdAndDelete({ _id: req.user?._id }, { new: true })
            if (!response) return res.status(404).json({ error: 'Not Found.' })

            await deleteFile(`logo/${response.image}`)
            return res.status(200).json({ redirect: '/login' })
        } catch (error) {
            console.log('deleteRecuirterInfo : ' + error.message)
        }
    },
    downloadResume: async (req, res) => {
        try {
            if (!validateId(req.params.candidateId) || !validateId(req.params.jobId)) {
                req.session.error = 'Something went wrong! Please try again later.'
                return res.status(400).redirect(`/recruiter/filter/candidates/${req.params.jobId}`)
            }

            const candidate = await userModel.findById({ _id: req.params.candidateId })
            const filePath = path.join(path.dirname(config.siteURL), `../uploads/userInfo/${candidate.resume}`); // full path to ZIP file

            // This will send the ZIP file as a download with the default filename
            return res.download(filePath, 'resume.zip', (err) => {
                if (err) {
                    req.session.error = 'Something went wrong! Please try again later.'
                    return res.status(400).redirect(`/recruiter/filter/candidates/${req.params.jobId}`)
                }
            })
        } catch (error) {
            console.log('downloadResume : ' + error.message)
        }
    },
}

export default usersControllers