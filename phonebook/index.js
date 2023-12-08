const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan("tiny"))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const number = persons.length
    const currentdate = new Date();

    response.send(`Phonebook has info for ${number} people 
    <br>${currentdate.toString()}<br/>`

    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === Number(id))

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.find(person => person.id == !Number(id))
    response.status(204).end()
})

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :body'));

app.post('/api/persons', (request, response) => {
    if (!request.body.name || !request.body.number) {
        return response.status(404).json({
            error: "value missing"
        })
    }

    for (const person of persons) {
        if (Object.values(person).includes(request.body.name)) {
            return response.status(400).json({
                error: "Name already exists"
            })
        }
    }

    const newPerson = {
        id: Math.floor(Math.random() * 101),
        name: request.body.name,
        number: request.body.number
    }
    persons = persons.concat(newPerson)
    response.json(persons)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})