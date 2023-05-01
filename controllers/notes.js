const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
})

notesRouter.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }

  // Note.findById(req.params.id)
  //   .then(note => {
  //     if (note) {
  //       res.json(note)
  //     } else {
  //       res.status(404).end()
  //     }
  //   })
  // .catch(error => next(error))
})

notesRouter.post('/', async (req, res) => {
  const body = req.body
  // the body content should not be empty
  if (!body.content) {
    // calling return here is essential bcause the code will execute to the very end and the malformed note get save to the app
    return res.status(400).json({
      error: 'content missing'
    })
  }
  const note = new Note({
    content: body.content,
    // default value of false if no important
    important: body.important || false,
  })
  const savedNote = await note.save()
  res.status(201).json(savedNote)
  // note.save().then(savedNote => {
  //   res.status(201).json(savedNote)
  // })
  // .catch(error => next(error))
})

notesRouter.delete('/:id', async (req, res) => {
  //express async errors library is used, therefore next and try catch block no longer needed.
  await  Note.findByIdAndRemove(req.params.id)
  res.status(204).end()
  // try {
  //   await  Note.findByIdAndRemove(req.params.id)
  //   res.status(204).end()
  // }catch(exception){
  //   next(exception)
  // }
  // Note.findByIdAndRemove(req.params.id)
  //   // eslint-disable-next-line no-unused-vars
  //   .then(result => {
  //     res.status(204).end()
  //   })
  //   .catch(error => next(error))
})

notesRouter.put('/api/notes/:id', (req, res, next) => {
  const { content, important } = req.body

  Note.findByIdAndUpdate(
    req.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter