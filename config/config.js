import dotenv from 'dotenv'
dotenv.config()

const config = {
    mongoDB_URL: process.env.MONGODB_URL,
    port: parseInt(process.env.PORT),
    siteURL: process.env.SITE_URL,
    securityKey: process.env.SECURITY_KEY,
}

export default config