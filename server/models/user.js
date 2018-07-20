const mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        bcrypt = require('bcrypt'),
        salted = 10


const UserSchema = new Schema({
    name: {type: String, required: true, index: {unique: true}},
    email: {type: String, required: true},
    password: {type: String, required: true},
    isLogin: {type: Boolean, default: false}
}, {
    timestamps: true
})

UserSchema.pre('save', function(next) {
    var user = this

    if(!user.isModified('password')) return next()

    bcrypt.genSalt(salted, function(err, salt) {
        if(err) return next(err)

        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err)

            user.password = hash
            next()
        })
    })
})

module.exports = mongoose.model('users', UserSchema)