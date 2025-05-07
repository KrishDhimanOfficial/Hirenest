import mongoose from "mongoose";

const jobSkillSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: [true, 'Input Field is required.'],
        trim: [true, 'Input Field contains spaces.'],
        match: [/[A-Za-z\s]{1,15}/, 'Invalid Input Field.']
    },
    status: {
        type: mongoose.Schema.Types.Boolean,
        required: [true, 'Status is required.'],
        default: true
    }
})

export default mongoose.model('jobskill', jobSkillSchema)