import fs from 'fs'
import path from 'path'
import config from '../config/config.js'
import archiver from 'archiver'

const Zip = async (doc) => {
    try {
        const __dirname = path.dirname(`${config.siteURL}`)
        const imagePath = path.join(__dirname, '../uploads', doc)

        const archive = archiver('zip', { zlib: { level: 9 } })
        archive.pipe(output);

        // Append the uploaded file to the zip
        archive.file(filePath, { name: req.file.originalname });

        // Finalize the archive (close the zip)
        archive.finalize();
    } catch (error) {
        console.log('deleteImage : ' + error.message)
    }
}


export default Zip