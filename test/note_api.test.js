const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')
const helper = require('./test_helper')


beforeEach(async () => {
  //deleteMany is mongose function
  await Note.deleteMany({})
  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()
  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})
test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies makin gasync calls',
    important: true,
  }
  //add new note
  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  //fetching all notes
  const notesAtEnd = await helper.notesInDB()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length +1 )

  const content = notesAtEnd.map(r => r.content)
  expect(content).toContain('async/await simplifies makin gasync calls')
})

test('note without content is not added', async () => {
  //dummy note body without content
  const newNote = {
    important:true
  }
  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd= await helper.notesInDB()

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
})




test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
},100000)

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(helper.initialNotes.length)
})


test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')
  const content = response.body.map (r => r.content)
  expect(content).toContain('Browser can execute only JavaScript')
})

afterAll(async () => {
  await mongoose.connection.close()
})