const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const validateEmail = (email) => {
    return (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email)
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Email Invalid'],
    },
    password: {
        type: String,
        required: 'Password is required',
        minlength: [8, 'Password must be at least 8 characters long']
    },
    created_at: { 
        type: Date,
        required: true,
        default: Date.now
    },
})

userSchema.pre('save', function (next){
    const user = this;
    if(user.isNew || user.isModified('password')){
        // run hashing and salting
        bcrypt.genSalt(10, (error, salt) => {
            if(error) {return next(error)}
            bcrypt.hash(user.password, salt, null, (error, hash) => {
                if(error) {
                    return next(error)
                }
                user.password = hash;
                next();
            })
        })
    } else {
        return next()
    }
})

userSchema.methods.comparePassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function(error, isMatch){
        if(error) {return callback(error)}
        callback(null, isMatch)
    })
}

module.exports = mongoose.model('User', userSchema)