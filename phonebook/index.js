require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan("tiny"))
app.use(cors())


app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(result => {
        const number = result.length
        const currentdate = new Date();

        response.send(`Phonebook has info for ${number} people 
        <br>${currentdate.toString()}<br/>`
        )
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(result => {
            if (result) {
                response.json(result)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :body'));

app.post('/api/persons', (request, response) => {
    if (!request.body.name || !request.body.number) {
        return response.status(404).json({
            error: "value missing"
        })
    }

    Person.find({ name: request.body.name })
        .then(result => {
            if (result.length > 0) {
                return response.status(400).json({
                    error: "Name already exists"
                })
            }
            const newPerson = new Person({
                name: request.body.name,
                number: request.body.number,
            })
            newPerson.save()
                .then(newPersonSaved => {
                    console.log('person saved!')
                    response.json(newPersonSaved)
                })
        })
})

app.put('/api/persons/:id', (request, response, next) => {
    const numberUpdate = {
        name: request.body.name,
        number: request.body.number
    }
    Person.findByIdAndUpdate(request.params.id, numberUpdate, {new: true})
    .then(result => {
        response.json(result)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})