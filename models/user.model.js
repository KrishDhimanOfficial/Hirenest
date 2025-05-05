import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
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
        match: [/[0-9].(jpg|jpeg|png|gif)/, 'Invalid image URL format.']
    },

    resume: {
        type: mongoose.Schema.Types.String,
        match: [/[0-9].(pdf)/, 'Invalid resume format.']
    },

    phone: {
        type: String,
        match: [/^[0-9]{1,10}$/, 'Invalid phone number. Should be 10 digits.'],
        trim: true
    },

    url: {
        type: String,
        match: [/^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/, 'Invalid URL.'],
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
        type: [String],
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
    }

}, { timestamps: true })


export default mongoose.model('User', userSchema)