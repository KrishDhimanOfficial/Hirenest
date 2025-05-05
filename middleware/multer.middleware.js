import multer from 'multer'
import path from 'path'

const MAX_SIZE = 1 * 1024 * 1024;

const createStorage = (dir) => multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./uploads/${dir}`)
    },
    filename: (req, file, cb) => {
        const randomNo = Math.round(Math.random() * 10)
        const newFileName = `${Date.now()}${randomNo}${path.extname(file.originalname)}`;
        cb(null, newFileName)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf']
    const ext = path.extname(file.originalname).toLowerCase()

    if (!allowedExtensions.includes(ext)) { // Check file extension
        return cb(new Error('only jpg, png, webp, pdf files are allowed'), false)
    }
    cb(null, true)
}

export const upload = multer()

export const userInfo = multer({
    storage: createStorage('userInfo'),
    limits: { fileSize: MAX_SIZE },
    fileFilter: fileFilter
})
export const companylogo = multer({
    storage: createStorage('logo'),
    limits: { fileSize: MAX_SIZE },
    fileFilter: fileFilter
})
