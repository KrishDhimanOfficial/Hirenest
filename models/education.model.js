import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const educationSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId
    },
    courseName: {
        type: String,
        required: [true, 'Course name is required'],
        trim: true,
        minlength: [2, 'Course name must be at least 2 characters'],
        maxlength: [100, 'Course name must be less than 100 characters']
    },
    specializedField: {
        type: String,
        trim: true
    },
    schoolORUniversity: {
        type: String,
        required: [true, 'School/University is required'],
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, 'Starting Date is required.'],
        set: v => {
            const date = new Date(v)
            return isNaN(date) ? undefined : date
        }
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
        set: v => {
            const date = new Date(v)
            return isNaN(date) ? undefined : date
        }
    },
    description: {
        type: String,
        maxlength: [1000, 'Description must be less than 1000 characters'],
        trim: true
    }
}, {
    timestamps: true
})

educationSchema.plugin(mongooseAggregatePaginate)
export default mongoose.model('education', educationSchema)