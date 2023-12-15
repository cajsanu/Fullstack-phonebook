const mongoose = require('mongoose')

const DBurl = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(DBurl)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3, 
        required: true
    },
     number: {
        type: String,
        minlength: 8,
        validate: {
            validator: (n => {
                return /^\d{2,3}-\d+$/.test(n) 
            }), 
            message: props => `Number should be in format 123-45678 or 12-345678`
        },
        required: true
     }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)