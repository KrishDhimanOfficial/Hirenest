import jwt from 'jsonwebtoken'
import config from '../config/config.js'

const setUser = (user) => {
    return jwt.sign(user, config.securityKey, { expiresIn: '2h' })
}

const getUser = (token) => {
    if (!token) return null
    return jwt.verify(token, config.securityKey)
}

export { setUser, getUser }