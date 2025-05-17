import mongoose from "mongoose";
import validate from "../services/validate.js";
import jobModel from "../models/job.model.js";
import { parseISO } from "date-fns";
import userModel from "../models/user.model.js";
import { City, State } from "country-state-city";
import handleAggregatePagination from "../services/handlepagePagination.js";
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
            const keywords = req.params.job.split(" ");

            const relevantJobspipeline = [
                {
                    $match: {
                        $and: [
                            {
                                $or: keywords.map(word => ({
                                    jobTitle: { $regex: word, $options: 'i' }
                                }))
                            },
                            {
                                jobTitle: { $ne: req.params.job }
                            },
                        ],
                        approved: true
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
                { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        jobTitle: 1, 'category.name': 1, state: 1, country: 1, experience: 1,
                        hideSalary: 1, salary: 1, companylogo: 1, shortDesc: 1, companyName: 1
                    }
                }
            ]
            const jobpipeline = [
                {
                    $match: { jobTitle: req.params.job }
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
                        from: 'degrees',
                        localField: 'degreeId',
                        foreignField: '_id',
                        as: 'degree'
                    }
                },
                {
                    $unwind: {
                        path: '$degree',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'jobtypes',
                        localField: 'jobTypeId',
                        foreignField: '_id',
                        as: 'empolymenttype'
                    }
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
                    $unwind: {
                        path: '$industry',
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
                { $unwind: '$user' },
                {
                    $lookup: {
                        from: 'jobskills',
                        localField: 'skills',
                        foreignField: '_id',
                        as: 'skills'
                    }
                },
                {
                    $addFields: {
                        appliedCount: { $size: '$appliedusersId' },
                        state: '$user.location.state',
                        country: '$user.location.country',
                        companylogo: '$user.image',
                        companyName: '$user.companyName',
                        daysSincePosted: {
                            $dateDiff: {
                                startDate: '$postDate',
                                endDate: '$$NOW',
                                unit: 'day'
                            }
                        }
                    }
                },
                {
                    $project: {
                        appliedCount: 1, jobTitle: 1, daysSincePosted: 1, 'category.name': 1, state: 1,
                        country: 1, experience: 1, hideSalary: 1, salary: 1, companylogo: 1, salaryRange: 1,
                        shortDesc: 1, companyName: 1, openings: 1, desc: 1,
                        skills: 1, 'industry.name': 1, empolymenttype: 1, 'degree.name': 1
                    }
                }
            ]

            const [job, relevantJobs] = await Promise.all([
                jobModel.aggregate(jobpipeline),
                jobModel.aggregate(relevantJobspipeline).limit(7).sort({ postDate: 1 })
            ])

            if (job.length === 0) return res.status(404).redirect('/404')

            const error = req.session.error;
            const success = req.session.success;

            delete req.session.error
            delete req.session.success

            return res.render('layout/site',
                {
                    body: '../site/jobDetails',
                    title: `Job Details - ${req.params.job}`,
                    user: req.user,
                    job: job[0], error, success, relevantJobs,
                    getState: State.getStateByCodeAndCountry
                }
            )
        } catch (error) {
            console.log('renderSearchDetails : ' + error.message)
        }
    },
    applyJob: async (req, res) => {
        try {
            if (!req.user) return res.status(400).redirect('/login')
            const job = await jobModel.findById({ _id: req.params.id }, { jobTitle: 1 })

            if (!validateId(req.params.id)) {
                req.session.error = 'Something went wrong! Please try again later.'
                return res.status(400).redirect(`/job/details/${job.jobTitle}`)
            }

            const response = await userModel.findByIdAndUpdate({ _id: req.user?._id },
                { $addToSet: { appliedJobs: [new ObjectId(req.params.id)] } }
            )

            if (!response) {
                req.session.error = 'Something went wrong! Please try again later.'
                return res.status(400).redirect(`/job/details/${job.jobTitle}`)
            }

            await jobModel.findByIdAndUpdate({ _id: req.params.id }, { $addToSet: { appliedusersId: [req.user?._id] } })
            req.session.success = 'Added to Applied List.'
            return res.status(200).redirect(`/job/details/${job.jobTitle}`)
        } catch (error) {
            console.log('applyJob : ' + error.message)
        }
    },
    filterAppliedJobs: async (req, res) => {
        try {
            const job = await jobModel.findById({ _id: req.params.jobId }, { skills: 1 })
            const pipeline = [
                {
                    $match: {
                        isrecuiter: false,
                        appliedJobs: {
                            $in: [new ObjectId(req.params.jobId)]
                        }
                    },
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
                    $unwind: {
                        path: '$degree',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        jobId: req.params.jobId, // used for redirect when resume downloading fails
                        resumeScore: {
                            $cond: [
                                { $gt: [job.skills.length, 0] }, // prevent division by zero
                                {
                                    $multiply: [
                                        {
                                            $divide: [
                                                {
                                                    $size: {
                                                        $filter: {
                                                            input: {
                                                                $map: {
                                                                    input: "$skills", // resume skills from DB
                                                                    as: "s",
                                                                    in: { $toLower: { $toString: "$$s" } } // ensure lowercase string
                                                                }
                                                            },
                                                            as: "resumeSkill",
                                                            cond: {
                                                                $in: [
                                                                    "$$resumeSkill",
                                                                    job.skills.map(s => s.toString().toLowerCase()) // lowercase array from JS
                                                                ]
                                                            }
                                                        }
                                                    }
                                                },
                                                job.skills.length
                                            ]
                                        },
                                        100
                                    ]
                                },
                                0
                            ]
                        },
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        phone: 1,
                        jobId: 1,
                        resumeScore: 1,
                        'degree.name': 1,
                        'location.state': 1,
                        'location.country': 1,
                        'location.city': 1
                    }
                }
            ]
            const candidates = await handleAggregatePagination(userModel, pipeline, req.query)
            return res.status(200).json(candidates)
        } catch (error) {
            console.log('filterAppliedJobs : ' + error.message)
        }
    },

    approveJob: async (req, res) => {
        try {
            if (!validateId(req.params.id)) return res.status(400).json({ error: 'Invalid Request.' })
            const { status } = req.body;

            const response = await jobModel.findByIdAndUpdate({ _id: req.params.id },
                { approved: status },
                { new: true, runValidators: true }
            )
            if (!response) return res.status(400).json({ error: 'Something went wrong, please try again later.' })
            return res.status(200).json({ success: 'updated successfully.' })
        } catch (error) {
            console.log('approveJob : ' + error.message)
        }
    },
}

export default jobControllers