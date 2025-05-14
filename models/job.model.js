import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Job category is required'],
        trim: true
    },
    industryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Job industry is required'],
        trim: true
    },
    jobTypeId: {
        type: [mongoose.Schema.Types.ObjectId],
        required: [true, 'Job type is required'],
        validate: {
            validator: v => Array.isArray(v) && v.length > 1,
            message: 'At least 1-2 Job Type is required'
        }
    },
    skills: {
        type: [mongoose.Schema.Types.ObjectId],
        validate: {
            validator: v => Array.isArray(v) && v.length > 1,
            message: 'At least 1-2 skill is required'
        }
    },
    tags: {
        type: [mongoose.Schema.Types.ObjectId],
        validate: {
            validator: v => Array.isArray(v) && v.length > 1,
            message: 'At least 1-2 Tag is required'
        }
    },
    degreeId: {
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
                const postDate = this.get('postDate')
                if (!v || !postDate) return false;
                return v.getTime() > postDate.getTime()
            },
            message: 'Expire date must be after post date'
        }
    },
    salary: {
        type: {
            min: Number,
            max: Number,
        },
        _id: false,
        required: [
            () => !this?.hideSalary,
            'salary is required.'
        ],
        set: (v) => {
            return v ? v : undefined
        }
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
        type: Number,
        required: [true, 'Experience is required']
    },
    currency: {
        symbol: String,
        name: String
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
        type: Boolean,
    },
    openings: {
        type: Number,
        required: [true, 'Jobs Opening is required']
    },
    recuriterId: {
        type: mongoose.Schema.Types.ObjectId,
        unquie: true
    },
    appliedusersId: {
        type: [mongoose.Schema.Types.ObjectId],
    }
}, { timestamps: true })

jobSchema.plugin(mongooseAggregatePaginate)
export default mongoose.model('Job', jobSchema)