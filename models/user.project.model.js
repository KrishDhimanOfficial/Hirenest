import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const userProjectsSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Input Field is required.'],
        trim: [true, 'Input Field contains spaces.'],
        match: [/[A-Za-z\s]{1,15}/, 'Name contains only 15 charcters.']
    },
    project_duration: {
        type: {
            start: {
                month: { type: mongoose.Schema.Types.Number },
                year: { type: mongoose.Schema.Types.Number }
            },
            end: {
                month: { type: mongoose.Schema.Types.Number },
                year: { type: mongoose.Schema.Types.Number }
            }
        },
        _id: false
    },
    skills: {
        type: [mongoose.Schema.Types.ObjectId],
        required: [true, 'Input Field is required.'],
        trim: [true, 'Input Field contains spaces.'],
        match: [/[A-Za-z\s]{1,10}/, 'Name contains only 10 charcters.'],
        maxlength: [10, 'Project skills must be 10 Length.']
    },
    desc: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Input Field is required.'],
        trim: [true, 'Input Field contains spaces.'],
        match: [/[A-Za-z\s]{1,250}/, 'Description contains only 250 charcters.']
    },
    url: {
        type: mongoose.Schema.Types.String,
        trim: [true, 'Input Field contains spaces.'],
        required: [true, 'Input Field is required.'],
        match: [/^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/, 'Invalid URL format.']
    }
})

userProjectsSchema.plugin(mongooseAggregatePaginate)
export default mongoose.model('userProjects', userProjectsSchema)