import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const jobTagSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: [true, 'Input Field is required.'],
        trim: [true, 'Input Field contains spaces.'],
        match: [/[A-Za-z\s]{1,15}/, 'Invalid Input Field.']
    },
    slug: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: [true, 'Input Slug Field is required.'],
        trim: [true, 'Input Slug Field contains spaces.'],
        match: [/[a-z\s]{1,15}/, 'Invalid Slug.']
    },
})

jobTagSchema.plugin(mongooseAggregatePaginate)
export default mongoose.model('jobTag', jobTagSchema)