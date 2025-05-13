import slugify from "slugify";
import jobCategoryModel from "../models/job.category.model.js";
import validate from "../services/validate.js";
import handleAggregatePagination from "../services/handlepagePagination.js";
import jobDegreeModel from "../models/job.degree.model.js";
import jobIndustryTypeModel from "../models/job.industry.type.model.js";
import jobTypeModel from "../models/job.type.model.js";
import jobTagModel from "../models/job.tag.model.js";
import mongoose, { Mongoose } from "mongoose";
import skillModel from "../models/skill.model.js";
const validateId = mongoose.Types.ObjectId.isValid;

const jobAttributesController = {
    createJob_category: async (req, res) => {
        try {
            const { name, industryId } = req.body;
            if (!validateId(industryId)) return res.status(400).json({ error: 'Select Category Industry.' })

            const checkExstence = await jobCategoryModel.findOne({ name })
            if (checkExstence) return res.status(400).json({ error: `${name} Category Exists.` })

            const response = await jobCategoryModel.create({
                name,
                industryId: new mongoose.Types.ObjectId(industryId),
                slug: slugify(name, {
                    replacement: '-',
                    lower: true,
                    trim: true,
                })
            })
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'Item created successfully.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createJob_category : ' + error.message)
        }
    },
    getSingle_job_category: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await jobCategoryModel.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
                },
                {
                    $lookup: {
                        from: 'jobindustrytypes',
                        localField: 'industryId',
                        foreignField: '_id',
                        as: 'industry'
                    }
                },
                { $unwind: '$industry' }
            ])
            
            if (!response) return res.status(404).json({ error: 'Not Found.' })
            return res.status(200).json(response[0])
        } catch (error) {
            console.log('getSingle_job_category  : ' + error.message)
        }
    },
    updateJob_category: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })
            // console.log(req.body);

            const { name, industryId } = req.body;
            if (!validateId(industryId)) return res.status(400).json({ error: 'Select Category Industry.' })

            const response = await jobCategoryModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    name,
                    industryId: new mongoose.Types.ObjectId(industryId),
                    slug: slugify(name, {
                        replacement: '-',
                        lower: true,
                        trim: true,
                    })
                },
                { new: true, runValidators: true })

            if (!response) return res.json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateJob_category : ' + error.message)
        }
    },
    updateJob_category_status: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const { status } = req.body;
            const response = await jobCategoryModel.findByIdAndUpdate({ _id: req.params.id },
                { status }, { new: true }
            )
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated successfully.' })
        } catch (error) {
            console.log('updateJob_category_status : ' + error.message)
        }
    },
    deleteJob_category: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await jobCategoryModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.status(404).json({ error: 'Not Found.' })
            return res.status(200).json({ success: 'Deleted successfully.' })
        } catch (error) {
            console.log('deleteJob_category : ' + error.message)
        }
    },
    createJob_degree: async (req, res) => {
        try {
            const { name } = req.body;

            const checkExstence = await jobDegreeModel.findOne({ name })
            if (checkExstence) return res.status(400).json({ error: `${name} Exists.` })

            const response = await jobDegreeModel.create({
                name,
                slug: slugify(name, {
                    replacement: '-',
                    lower: true,
                    trim: true,
                })
            })
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'Item created successfully.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createJob_degree : ' + error.message)
        }
    },
    getSingleJob_degree: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await jobDegreeModel.findById({ _id: req.params.id })
            if (!response) return res.status(404).json({ error: 'Not Found.' })
            return res.status(200).json(response)
        } catch (error) {
            console.log('getSingleJob_degree : ' + error.message)
        }
    },
    updateJob_degree: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const { name, status } = req.body;
            const response = await jobDegreeModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    name, status,
                    slug: slugify(name, {
                        replacement: '-',
                        lower: true,
                        trim: true,
                    })
                },
                { new: true, runValidators: true }
            )
            if (!response) return res.status(404).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateJob_degree  : ' + error.message)
        }
    },
    updateJob_degree_status: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const { status } = req.body;
            const response = await jobDegreeModel.findByIdAndUpdate({ _id: req.params.id },
                { status }, { new: true }
            )
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated successfully.' })
        } catch (error) {
            console.log('updateJob_degree_status : ' + error.message)
        }
    },
    deleteJob_degree: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await jobDegreeModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.status(404).json({ error: 'Not Found.' })
            return res.status(200).json({ success: 'Deleted successfully.' })
        } catch (error) {
            console.log('deleteJob_degree : ' + error.message)
        }
    },
    createJob_industry: async (req, res) => {
        try {
            const { name } = req.body;
            const checkExstence = await jobIndustryTypeModel.findOne({ name })
            if (checkExstence) return res.status(400).json({ error: `${name} Exists.` })

            const response = await jobIndustryTypeModel.create({
                name,
                slug: slugify(name, {
                    replacement: '-',
                    lower: true,
                    trim: true,
                })
            })
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'Item created successfully.' })
        } catch (error) {
            console.log('createJob_industry : ' + error.message)
        }
    },
    getSingleJob_industry: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await jobIndustryTypeModel.findById({ _id: req.params.id })
            if (!response) return res.status(404).json({ error: 'Not Found.' })
            return res.status(200).json(response)
        } catch (error) {
            console.log('getSingleJob_industry : ' + error.message)
        }
    },
    updateJob_industry: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const { name, status } = req.body;
            const response = await jobIndustryTypeModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    name, status,
                    slug: slugify(name, {
                        replacement: '-',
                        lower: true,
                        trim: true,
                    })
                },
                { new: true, runValidators: true }
            )
            if (!response) return res.status(404).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateJob_industry  : ' + error.message)
        }
    },
    updateJob_industry_status: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const { status } = req.body;
            const response = await jobIndustryTypeModel.findByIdAndUpdate({ _id: req.params.id },
                { status }, { new: true }
            )
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated successfully.' })
        } catch (error) {
            console.log('updateJob_industry_status : ' + error.message)
        }
    },
    deleteJob_industry: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await jobIndustryTypeModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.status(404).json({ error: 'Not Found.' })
            return res.status(200).json({ success: 'Deleted successfully.' })
        } catch (error) {
            console.log('deleteJob_industry : ' + error.message)
        }
    },
    createJob_type: async (req, res) => {
        try {
            const { name } = req.body;
            const checkExstence = await jobTypeModel.findOne({ name })
            if (checkExstence) return res.status(400).json({ error: `${name} Exists.` })

            const response = await jobTypeModel.create({
                name,
                slug: slugify(name, {
                    replacement: '-',
                    lower: true,
                    trim: true,
                })
            })
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'Item created successfully.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createJob_type : ' + error.message)
        }
    },
    getSingleJob_type: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await jobTypeModel.findById({ _id: req.params.id })
            if (!response) return res.status(404).json({ error: 'Not Found.' })
            return res.status(200).json(response)
        } catch (error) {
            console.log('getSingleJob_type : ' + error.message)
        }
    },
    updateJob_type: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const { name, status } = req.body;
            const response = await jobTypeModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    name, status,
                    slug: slugify(name, {
                        replacement: '-',
                        lower: true,
                        trim: true,
                    })
                },
                { new: true, runValidators: true }
            )
            if (!response) return res.status(404).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateJob_type : ' + error.message)
        }
    },
    updateJob_type_status: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const { status } = req.body;
            const response = await jobTypeModel.findByIdAndUpdate({ _id: req.params.id },
                { status }, { new: true }
            )
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated successfully.' })
        } catch (error) {
            console.log('updateJob_type_status : ' + error.message)
        }
    },
    deleteJob_type: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await jobTypeModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.status(404).json({ error: 'Not Found.' })
            return res.status(200).json({ success: 'Deleted successfully.' })
        } catch (error) {
            console.log('deleteJob_type : ' + error.message)
        }
    },
    createJob_tag: async (req, res) => {
        try {
            const { name } = req.body;
            const checkExstence = await jobTagModel.findOne({ name })
            if (checkExstence) return res.status(400).json({ error: `${name} Exists.` })

            const response = await jobTagModel.create({
                name,
                slug: slugify(name, {
                    replacement: '-',
                    lower: true,
                    trim: true,
                })
            })
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'Item created successfully.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createJob_tag : ' + error.message)
        }
    },
    getSingleJob_tag: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await jobTagModel.findById({ _id: req.params.id })
            if (!response) return res.status(404).json({ error: 'Not Found.' })
            return res.status(200).json(response)
        } catch (error) {
            console.log('getSingleJob_tag : ' + error.message)
        }
    },
    updateJob_tag: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const { name } = req.body;
            const response = await jobTagModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    name, slug: slugify(name, {
                        replacement: '-',
                        lower: true,
                        trim: true,
                    })
                },
                { new: true, runValidators: true }
            )
            if (!response) return res.status(404).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateJob_tag : ' + error.message)
        }
    },
    deleteJob_tag: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await jobTagModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.status(404).json({ error: 'Not Found.' })
            return res.status(200).json({ success: 'Deleted successfully.' })
        } catch (error) {
            console.log('deleteJob_tag : ' + error.message)
        }
    },
    renderJobSkills: async (req, res) => {
        try {
            if (req.params.id.length !== 24) return res.status(400).json({ error: 'Invalid Request.' })
            const checkExstence = await model.findOne({ name })
            if (checkExstence) return res.status(400).json({ error: `Exists.` })
            const response = await model;
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated successfully.' })
        } catch (error) {
            console.log(' renderJobSkills : ' + error.message)
        }
    },
    createJob_Skill: async (req, res) => {
        try {
            const { name } = req.body;

            const checkExstence = await skillModel.findOne({ name })
            if (checkExstence) return res.status(400).json({ error: `${name} Exists.` })

            const response = await skillModel.create({ name })
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated successfully.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('createJob_Skill : ' + error.message)
        }
    },
    getSingleJob_Skill: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await skillModel.findById({ _id: req.params.id })
            if (!response) return res.status(404).json({ error: 'Not Found.' })
            return res.status(200).json(response)
        } catch (error) {
            console.log('getSingleJob_Skill : ' + error.message)
        }
    },
    updateJob_Skill: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })
            const { name } = req.body;

            const response = await skillModel.findByIdAndUpdate(
                { _id: req.params.id },
                { name },
                { new: true, runValidators: true }
            )
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated successfully.' })
        } catch (error) {
            if (error.name === 'ValidationError') validate(res, error.errors)
            console.log('updateJob_Skill : ' + error.message)
        }
    },
    updatejob_skillStatus: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })
            const { status } = req.body;

            const response = await skillModel.findByIdAndUpdate({ _id: req.params.id },
                { status },
                { new: true, runValidators: true }
            )
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated successfully.' })
        } catch (error) {
            console.log('updatejob_skillStatus : ' + error.message)
        }
    },
    deleteJob_skill: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })

            const response = await skillModel.findByIdAndDelete({ _id: req.params.id })
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'Deleted successfully.' })
        } catch (error) {
            console.log('deleteJob_skill : ' + error.message)
        }
    },
}

export default jobAttributesController