import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const jobCategorySchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: [true, 'Input Field is required.'],
        trim: [true, 'Input Field contains spaces.'],
        match: [/[A-Za-z\s]/, 'Invalid Input Field.'],
        maxlength: [15, 'Name must be at least 15 characters long.']
    },
    slug: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: [true, 'Input Slug Field is required.'],
        trim: [true, 'Input Slug Field contains spaces.'],
        match: [/[a-z\s]/, 'Invalid Slug.'],
        maxlength: [15, 'Slug must be at least 15 characters long.']

    },
    status: {
        type: mongoose.Schema.Types.Boolean,
        required: [true, 'Status is required.'],
        default: true
    }
})

jobCategorySchema.plugin(mongooseAggregatePaginate)
export default mongoose.model('job_category', jobCategorySchema)