require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')
console.log(Note, typeof(Note))


app.use(cors())
app.use(express.static('build'))
// we use json-parser to receive data by the command below
app.use(express.json())

// let notes = [
//     {
//         id: 1,
//         content: "HTML is easy",
//         important: true
//     },
//     {
//         id: 2,
//         content: "Browser can execute only JavaScript",
//         important: false
//     },
//     {
//         id: 3,
//         content: "GET and POST are the most important methods of HTTP protocol",
//         important: true
//     }
// ]

const requestLogger = (req, res, next)=>{
    console.log('Method:', req.method)
    console.log('Path:', req.path)
    console.log('Body:', req.body)
    console.log('______-')
    next()
}

app.use(requestLogger)

app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes =>{
        res.json(notes)
    })
})
app.get('/api/notes/:id', (req, res, next) => {
    Note.findById(req.params.id).then(note => {
        if(note){
            res.json(note)
        }else{
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})
app.delete('/api/notes/:id', (req, res, next) => {
    Note.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error =>next(error))
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
   const note = new Note({
    content: body.content,
    // default value of false if no important 
    important:body.important || false,
   })
   note.save().then(savedNote => {
    res.json(savedNote)
   })
})

app.put('/api/notes/:id', (req, res, next)=>{
    const body = req.body
    const note = {
        content:body.content,
        important:body.important,
    }
    Note.findByIdAndUpdate(req.params.id, note, {new: true})
    .then(updatedNote =>{
        res.json(updatedNote)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) =>{
    console.log(error.message)
    if(error.name === 'CastError'){
        return res.status(400).send({error: 'malformatted id'})
    }
    next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
