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
        validate: [validateEmail, 'Email Invalid'],
    },
    password: {
        type: String,
        minlength: [8, 'Password must be at least 8 characters long']
    },
    accessToken: {
        type: String
    },
    spotifyId: {
        type: String
    },
    created_at: { 
        type: Date,
        required: true,
        default: Date.now
    },
})

userSchema.pre('save', async function (next){
    const user = this;
    if(user.password){
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
})

userSchema.methods.comparePassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function(error, isMatch){
        if(error) {return callback(error)}
        callback(null, isMatch)
    })
}

module.exports = mongoose.model('User', userSchema)