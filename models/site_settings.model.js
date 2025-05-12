import mongoose from "mongoose";

const sitesettingschema = new mongoose.Schema({
    logo: {
        type: mongoose.Schema.Types.String,
        match: [/[0-9].(jpg|jpeg|png|webp)/, 'Invalid image format.']
    },
    term_condition: {
        type: mongoose.Schema.Types.String
    }
})

export default mongoose.model('site_settings', sitesettingschema)