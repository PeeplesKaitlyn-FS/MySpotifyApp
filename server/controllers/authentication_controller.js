const User = require("../models/user")
const jwt = require("jwt-simple")
const bcrypt = require("bcrypt")
const config = require("../config")

const tokenForUser = (user) => {
    const timestamp = new Date().getTime()
    return jwt.encode({
        sub: user.id, 
        iat: timestamp
    }, config.secret)
}

exports.signin = async (req, res, next) => {
    const user = req.user
    res.send({user_id: user._id, token: tokenForUser(user)})
}

exports.signup = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if(!email || !password) {
            return res.status(422).json({ message: "Email and password are required"})
        }

        User.findOne({email: email}), (error, existingUser) => {
            if(error) {return next(error)}
            if(existingUser) {return res.status(422).json({ message: "Email is already in use"})}
            
            const user = new User({ 
                email: email, 
                password: password 
            })

            user.save((error) => {
                if(error) {return next(error)}
                res.json({user_id: user._id, token: tokenForUser(user)})
            })
        }
    } catch(error) {
        return next(error)
    }
}