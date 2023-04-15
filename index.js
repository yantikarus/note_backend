const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
// we use json-parser to receive data by the command below
app.use(express.json())

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

const requestLogger = (req, res, next)=>{
    console.log('Method:', req.method)
    console.log('Path:', req.path)
    console.log('Body:', req.body)
    console.log('______-')
    next()
}

app.use(requestLogger)

// app.get('/', (req, res) => {
//     res.send()
// })
app.get('/api/notes', (req, res) => {
    res.json(notes)
})
app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    const note = notes.find(note => {
        return note.id === id
    })
    if (note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})
app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note=> note.id !==id)
    res.status(204).end()
})

const generateId =()=> {
    // does notes length more than 0 if yes copy the notes and map their id
    const maxId = notes.length > 0? Math.max(...notes.map(n=> n.id)) : 0
    return  maxId + 1
}

app.post('/api/notes', (req, res)=> {
    const body = req.body
    // the body content should not be empty
    if(!body.content){
        // calling return here is essential bcause the code will execute to the very end and the malformed note get save to the app
        return res.status(400).json({
            error: 'content missing'
        })
    }
   const note = {
    content: body.content,
    // default value of false if no important 
    important:body.important || false,
    id: generateId(),
   }
    notes = notes.concat(note)
    console.log(note)
    res.json(note)
})

// const app = http.createServer((req, res)=>{
//     res.writeHead(200, {'Content-Type': 'application/json'})
//     res.end(JSON.stringify(notes))
// })
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
