const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan("tiny"))
app.use(cors())

let persons = [
      {
        "name": "Cajsa",
        "number": "404",
        "id": 1
      },
      {
        "name": "Secret lover",
        "number": "666",
        "id": 6
      },
      {
        "name": "Saschku",
        "number": "10/10",
        "id": 7
      },
      {
        "name": "Benjamin",
        "number": "900",
        "id": 9
      },
      {
        "name": "Melvin",
        "number": "111",
        "id": 10
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
    persons = persons.filter(person => person.id !== Number(id))
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
    response.json(newPerson)
})


const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})