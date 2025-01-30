const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')

morgan.token('post_data', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :post_data'))


let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Current phonebook contacts: ${persons.length}</p>
        <p> ${new Date()}</p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()

})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        response.status(400).json({
            error: "Name missing"
        })
    }
    else if (!body.number) {
        response.status(400).json({
            error: "Number missing"
        })
    }
    else if (persons.find(p => p.name === body.name)) {
        response.status(400).json({
            error: "Name already exists"
        })
    } else {
        const person = {
            id: String(Math.floor(Math.random() * (10000000 - 1 + 1)) + 1),
            name: body.name,
            number: body.number
        }
        persons = persons.concat(person)
        response.json(person)
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})