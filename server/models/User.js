const { model, Schema } = require('mongoose')
const { hash, compare } = require('bcryptjs') //using bcryptjs for efficency

function validateEmail(value) {
    const exp = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)

    return exp.test(value)
}

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },

    email: {
        type: String,
        unique: true,
        required: true,
        validate: [validateEmail, 'You must enter a valid email address']
    },

    password: {
        type: String,
        required: true,
        minLength: [6, 'Your password must be at least 6 characters in length']
    },

    avatar: {
        type: String,
    },
})

// userSchema.methods.toJSON = function () {
//     const user = this.toObject();

//     delete user.password;

//     return user;
// }

// userSchema.methods.validatePass = async function (formPassword) {
//     const valid = await compare(formPassword, this.password)

//     return valid
// }

// userSchema.pre('save', async function (next) {
//     if (this.isNew) {
//         this.password = await hash(this.password, 10)
//     }

//     next()
// })

const User = model('User', userSchema)

module.exports = User