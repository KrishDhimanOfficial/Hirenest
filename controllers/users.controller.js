import userModel from "../models/user.model.js"
import { setUser, getUser } from "../services/auth.js"
import bcrypt from 'bcrypt'
import validate from "../services/validate.js"
import userProjectModel from "../models/user.project.model.js"
import mongoose from "mongoose";
const validateId = mongoose.Types.ObjectId.isValid;

const usersControllers = {
    createUser: async (req, res) => {
        try {
            console.log(req.body);

            const { name, email, password, confirmpassword, phone, isrecuiter } = req.body;
            if (password !== confirmpassword) return res.status(400).json({ error: "Password dosen't Match." })

            const checkExstence = await userModel.findOne({ email })
            if (checkExstence) return res.status(400).json({ error: "Email is already in use." })

            const response = await userModel.create({
                name, email, phone,
                password: await bcrypt.hash(password, 10),
                isrecuiter: isrecuiter ? true : false
            })
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'Item created successfully.' })
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
            const { name, phone, gender, address, country, state, city, bio, url } = req.body;
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const docToBeupdate = {
                name, phone, gender,
                location: { address, country, state, city },
                bio, url
            }

            if (req.files['image']) docToBeupdate.image = req.files['image'][0].filename
            if (req.files['resume']) docToBeupdate.resume = req.files['resume'][0].filename

            const response = await userModel.findByIdAndUpdate(
                { _id: req.params.id },
                docToBeupdate,
                { new: true, runValidators: true }
            )
            // TODO : add a function to delete candidate pdf and image
            if (!response) return res.status(404).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateuserInfo : ' + error.message)
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