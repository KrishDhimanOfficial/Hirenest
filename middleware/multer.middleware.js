import multer from 'multer'
import path from 'path'

const MAX_SIZE = 3 * 1024 * 1024;
const imageMaxSize = 1 * 1024 * 1024;
const resumeMaxSize = 5 * 1024 * 1024;

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
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']
    const ext = path.extname(file.originalname).toLowerCase()

    if (!allowedExtensions.includes(ext)) { // Check file extension
        return cb(new Error('only jpg, png, webp, files are allowed'), false)
    }
    cb(null, true)
}

const filterUserInfo = (req, file, cb) => {
    file.stream?.on('data', chunk => {
        file._size = (file._size || 0) + chunk.length;

        const condition = (file.fieldname === 'image' && file._size > imageMaxSize) ||
            (file.fieldname === 'resume' && file._size > resumeMaxSize)
        if (condition) {
            cb(
                new multer.MulterError('LIMIT_FILE_SIZE', `${file.fieldname} exceeds size limit`),
                false
            )
        }
    })
    cb(null, true) // Accept initially — we'll check as data streams in
}


export const upload = multer()

export const userInfo = multer({
    storage: createStorage('userInfo'),
    limits: { fileSize: MAX_SIZE },
    fileFilter: filterUserInfo
})

export const companylogo = multer({
    storage: createStorage('logo'),
    limits: { fileSize: MAX_SIZE },
    fileFilter: fileFilter
})
