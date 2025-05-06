
export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() && req.user?.role === 'admin') return next()
    return res.status(401).redirect('/dashboard/login')
} // Check super Admin Access

export const checkIsRecruiter = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).redirect('/login')
    }
    if (!req.user.isactive) {
        return res.status(401).redirect('/login')
    }
    if (req.user.isrecuiter) {
        return next()
    }
    return res.status(401).redirect('/profile')
} // Check Recuriter Routes


export const checkIsCandidate = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).redirect('/login')
    }
    if (req.user.isrecuiter) {
        return res.status(401).redirect('/recruiter')
    }
    if (!req.user.isactive) {
        return res.status(401).redirect('/login')
    }
    return next()
} // Check Candidate Routes