const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

//define function to extract token
const getTokenFrom = req => {

  const authorization = req.get('authorization')
  console.log('the auth from gettokenfrom is', authorization)
  if(authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.get('/', async (req, res) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name:1 })
  res.json(notes)
})

notesRouter.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

notesRouter.post('/', async (req, res) => {
  const body = req.body
  //we check if the token match by verify ing it
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  console.log('the decoded token is', decodedToken)
  if(!decodedToken.id){
    return res.status(401).json({ error: 'token invalid' })
  }
  //now check in db with decoded token id, as token will extract username and id
  const user = await User.findById(decodedToken.id)
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
    important: body.important === undefined ? false : body.important,
    user: user.id
  })
  const savedNote = await note.save()
  //update user notes by concating the savedNote id
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
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

notesRouter.put('/:id', (req, res, next) => {
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