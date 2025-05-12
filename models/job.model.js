import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Job category is required'],
        trim: true
    },
    jobType: {
        type: [mongoose.Schema.Types.ObjectId],
        required: [true, 'Job type is required']
    },
    skills: {
        type: [mongoose.Schema.Types.ObjectId],
        validate: {
            validator: v => Array.isArray(v) && v.length > 0,
            message: 'At least one skill is required'
        }
    },
    tags: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    degree: {
        type: mongoose.Schema.Types.ObjectId,
    },
    postDate: {
        type: Date,
        required: [true, 'Post Date is required.'],
        set: v => {
            const date = new Date(v)
            return isNaN(date) ? undefined : date
        },
    },
    expireDate: {
        type: Date,
        required: [true, 'Expire date is required'],
        set: v => {
            const date = new Date(v)
            return isNaN(date) ? undefined : date
        },
        validate: {
            validator: function (v) {
                return v > this.postDate;
            },
            message: 'Expire date must be after post date'
        }
    },
    salary: {
        type: Number,
        min: [0, 'Invalid Salary Input Field.']
    },
    hideSalary: {
        type: Boolean,
        default: false
    },
    salaryRange: {
        type: String,
        enum: ['Monthly', 'Yearly', 'Weekly', 'Daily', 'Hourly'],
        default: 'Monthly'
    },
    experience: {
        type: String,
        required: [true, 'Experience is required']
    }, // TODO : setting proper validation
    location: {
        type: {
            country: { type: String, trim: true },
            state: { type: String, trim: true },
            city: { type: String, trim: true },
            address: {
                type: String, trim: true,
                maxlength: [100, 'Address too long.']
            },
        },
        _id: false
    },
    shortDesc: {
        type: String,
        required: [true, 'Short description is required'],
        maxlength: [300, 'Short description must not exceed 300 characters']
    },
    desc: {
        type: String,
        required: [true, 'Job description is required']
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Closed'],
        default: 'Active'
    }
}, { timestamps: true })

export default mongoose.model('Job', jobSchema)