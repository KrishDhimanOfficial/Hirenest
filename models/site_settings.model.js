import mongoose from "mongoose";

const sitesettingschema = new mongoose.Schema({
    logo: {
        type: mongoose.Schema.Types.String,
        match: [/[0-9].(jpg|jpeg|png|webp)/, 'Invalid image format.']
    },
    companyname: {
        type: String,
        required: [true, 'Company Name is required!'],
        match: [/^[A-Za-z\s]{1,30}$/, 'Name must be 1-30 characters and only letters/spaces.'],
        trim: true,
    },
    contact: {
        type: String,
        match: [/^[0-9]{1,10}$/, 'Invalid phone number. Should be 10 digits.'],
        trim: true
    },
    companyemail: {
        type: String,
        required: [true, 'Email is required!'],
        match: [/^[a-z0-9._%+-]+@gmail\.com$/, 'Email must be a email address.'],
        unique: true,
        lowercase: true,
        trim: true
    },
    term_condition: {
        type: mongoose.Schema.Types.String
    },
    aboutTitle: {
        type: String,
        required: [true, 'Company Name is required!'],
        match: [/^[A-Za-z\s]{1,30}$/, 'Name must be 1-30 characters and only letters/spaces.'],
        trim: true,
    },
    desc: { type: String, },
    chooseus_title: {
        type: String,
        required: [true, 'Company Name is required!'],
        match: [/^[A-Za-z\s]{1,30}$/, 'Name must be 1-30 characters and only letters/spaces.'],
        trim: true,
    },
    chooseus_desc: { type: String, }
})

export default mongoose.model('site_settings', sitesettingschema)