import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        match: [/^[A-Za-z\s]{1,30}$/, 'Name must be 1-30 characters and only letters/spaces.'],
        trim: true,
    },

    companyName: {
        type: String,
        required: [true, 'Company Name is required!'],
        match: [/^[A-Za-z\s]{1,30}$/, 'Name must be 1-30 characters and only letters/spaces.'],
        trim: true,
    },

    email: {
        type: String,
        required: [true, 'Email is required!'],
        match: [/^[a-z0-9._%+-]+@gmail\.com$/, 'Email must be a valid Gmail address.'],
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: [true, 'Password is required!'],
        minlength: [6, 'Password must be at least 6 characters long.']
    },

    gender: {
        type: String,
        enum: {
            values: ['m', 'f'],
            message: 'Gender must be "Male" or "Female".'
        }
    },

    location: {
        country: { type: String, trim: true },
        state: { type: String, trim: true },
        city: { type: String, trim: true },
        address: { type: String, trim: true, maxlength: [100, 'Address too long.'] }
    },

    image: {
        type: String,
        match: [/[0-9].(jpg|jpeg|png|webp)/, 'Invalid image URL format.']
    },

    resume: {
        type: mongoose.Schema.Types.String,
        match: [/[0-9].(zip)/, 'Invalid resume format.']
    },

    phone: {
        type: String,
        match: [/^[0-9]{1,10}$/, 'Invalid phone number. Should be 10 digits.'],
        trim: true
    },

    url: {
        type: String,
        match: [
            /^(https:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[\w\-._~\/]*)?(#[\w\-]*)?$/,
            'Invalid URL.'
        ],
        trim: true
    },

    bio: {
        type: String,
        match: [/^[A-Za-z0-9\s.,'"\-!?()]{1,200}$/, 'Bio must be 1-200 valid characters.'],
        trim: true
    },

    role: {
        type: String,
        enum: {
            values: ['admin'],
            message: 'Only "admin" role is allowed.'
        },
    },

    skills: {
        type: [mongoose.Schema.Types.ObjectId],
        validate: {
            validator: (v) => v.length <= 10,
            message: 'You can only add up to 10 skills.'
        }
    },

    isrecuiter: {
        type: Boolean,
        default: false
    },

    isactive: {
        type: Boolean,
        default: true
    },

    degreeId: { type: mongoose.Schema.Types.ObjectId },
    jobsId: { type: [mongoose.Schema.Types.ObjectId] },
    appliedJobs: { type: [mongoose.Schema.Types.ObjectId] },
    savedJobs: { type: [mongoose.Schema.Types.ObjectId] },
    userprojectIds: { type: [mongoose.Schema.Types.ObjectId] },

}, { timestamps: true })

userSchema.plugin(mongooseAggregatePaginate)
export default mongoose.model('User', userSchema)