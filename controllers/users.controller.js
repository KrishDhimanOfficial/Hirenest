import userModel from "../models/user.model.js"
import bcrypt from 'bcrypt'
import validate from "../services/validate.js"
import userProjectModel from "../models/user.project.model.js"
import mongoose from "mongoose";
import deleteFile from '../services/deleteFile.js'

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
            const { name, phone, gender, address, skills, country, state, city, bio, url } = req.body;

            if (!name || !phone || !gender || !address || !country || !state || !city || !bio || !url) {
                return res.status(400).json({ info: "All Fields Required." })
            }
            if (skills.length > 10) return res.status(400).json({ info: "Skills can't be more than 10" })
            if (skills.length <= 1) return res.status(400).json({ info: 'Select Atleast 2-3 Skills.' })

            const docToBeupdate = {
                name, phone, gender,
                location: { address, country, state, city },
                skills: skills.map(id => new ObjectId(id)),
                bio, url
            }

            if (req.files['image']) docToBeupdate.image = req.files['image'][0].filename
            if (req.files['resume']) docToBeupdate.resume = req.files['resume'][0].filename

            const response = await userModel.findByIdAndUpdate(
                { _id: req.user?._id },
                docToBeupdate,
                { new: true, runValidators: true }
            )
            // TODO : add a function to delete candidate pdf and image
            if (!response) return res.status(404).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            if (req.files['image']) deleteFile(`userInfo/${req.files['image'][0].filename}`)
            if (req.files['resume']) deleteFile(`userInfo/${req.files['resume'][0].filename}`)
            console.log('updateuserInfo : ' + error.message)
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
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await userModel.findByIdAndDelete({ _id: req.params.id })
            // TODO : add a function to delete candidate pdf and image
            if (!response) return res.status(404).json({ error: 'Not Found.' })
            return res.status(200).json({ success: 'Deleted successfully.' })
        } catch (error) {
            console.log('deleteuserInfo : ' + error.message)
        }
    },
    createUserProject: async (req, res) => {
        try {
            const { name, desc, start, end, url } = req.body;
            const response = await userProjectModel.create({
                name, desc,
                project_duration: { start, end },
                url
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

            const response = await userProjectModel.findById({ _id: req.params.id })
            if (!response) return res.status(404).json({ error: 'Not Found.' })
            return res.status(200).json(response)
        } catch (error) {
            console.log('get_userProject : ' + error.message)
        }
    },
    update_userProject: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const { name, desc, start, end, url } = req.body;
            const response = await userProjectModel.findByIdAndUpdate(
                { _id: req.params.id },
                { name, desc, project_duration: { start, end }, url },
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
            return res.status(200).json({ success: 'Deleted successfully.' })
        } catch (error) {
            console.log('delete_userProject : ' + error.message)
        }
    }
}

export default usersControllers