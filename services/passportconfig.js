import { Strategy as LocalStrategy } from 'passport-local';
import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';

export default function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email })

            if (!user) return done(null, false, { error: 'User not found' });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return done(null, false, { error: 'Incorrect password' })

            return done(null, user)
        } catch (err) {
            return done(err)
        }
    }))

    passport.serializeUser((user, done) => { done(null, user._id) })

    passport.deserializeUser(async (_id, done) => {
        try {
            const user = await userModel.findById(_id)
            done(null, user)
        } catch (err) {
            done(err)
        }
    })
}
