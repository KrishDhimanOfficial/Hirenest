import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const experienceSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        minlength: [2, 'Company name must be at least 2 characters'],
        maxlength: [100, 'Company name must be less than 100 characters']
    },
    position: {
        type: String,
        required: [true, 'Position is required'],
        trim: true,
        minlength: [2, 'Position must be at least 2 characters'],
        maxlength: [100, 'Position must be less than 100 characters']
    },
    startDate: {
        type: Date,
        required: [true, 'Starting Date is required.'],
        set: v => {
            const date = new Date(v)
            return isNaN(date) ? undefined : date
        },
    },
    endDate: {
        type: Date,
        required: [
            () => !this?.stillworking,
            'End Date is required.'
        ],
        set: v => {
            const date = new Date(v)
            return isNaN(date) ? undefined : date
        }
    },
    stillworking: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description must be under 1000 characters']
    }
}, {
    timestamps: true
})

experienceSchema.plugin(mongooseAggregatePaginate)
export default mongoose.model('experience', experienceSchema)