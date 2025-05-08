import fs from 'fs'
import path from 'path'
import config from '../config/config.js'
import archiver from 'archiver'
import deleteFile from './deleteFile.js'

const ZipFile = async (req, res) => {
    try {
        const file = req.files['resume'][0]
        const fileName = `${path.parse(file.filename).name}.zip`;

        const __dirname = path.dirname(`${config.siteURL}`)
        const zipPath = path.join(__dirname, `../uploads/userInfo/${fileName}`)

        const output = fs.createWriteStream(zipPath)
        const archive = archiver('zip', { zlib: { level: 9 } })

        output.on('close', async () => {
            // remove original pdf
            await deleteFile(`userInfo/${file.filename}`)
        })

        archive.on('error', (err) => {
            console.error('Error while creating zip:', err)
            return res.status(500).json({ error: 'Error occur during resume uploading.' })
        })

        archive.pipe(output)

        // Append the uploaded file to the zip
        archive.file(file.path, { name: file.originalname })

        // Finalize the archive (close the zip)
        await archive.finalize()
    } catch (error) {
        console.log('deleteImage : ' + error.message)
    }
}

export default ZipFile