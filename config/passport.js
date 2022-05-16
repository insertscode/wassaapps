const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')

const User = require('../models/User')
const FlashData = require('../models/FlashData')


module.exports = function (passport) {
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => { 
            try {
                let user = {
                    firstName: profile.name.givenName, 
                    lastName: profile.name.familyName, 
                    displayName: profile.displayName, 
                    googleId: profile.id, 
                    background: "papaya",
                    image: profile.photos[0].value,
                    flashId: "null"
                }
                let userExists = await User.findOne({ googleId: profile.id })
                if (!userExists) {
                    const newData = new FlashData({
                        displayName: profile.displayName, 
                        email: profile.id, 
                        background: 'papaya', 
                        flashcards: {
                            question: "Whats round, brown, and sticky?", 
                            answer:"A stick!", 
                            set:"Example", 
                            color:"Peru"
                        }, 
                        categories: ['Example']
                    });
                    user.flashId = newData.id
                    let userRecord = await User.create(user)
                    let cards = await FlashData.create(newData)
                    done(null, userRecord)
                }
                done(null, userExists)
            } catch (err) { 
                console.error(err); 
            }
        }))
    passport.serializeUser( (user, done) => { done(null, user.id) })
    passport.deserializeUser( (id, done) => { User.findById(id, (err, user) => done(err, user)) })
}
