const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')
const helper = require('./test_helper')


beforeEach(async () => {
  //deleteMany is mongose function
  await Note.deleteMany({})
  await Note.insertMany(helper.initialNotes)
  // console.log('cleared')
  // const noteObjects = helper.initialNotes.map(note => new Note(note))
  // const promiseArray = noteObjects.map(note => note.save())
  // await Promise.all(promiseArray)


  // helper.initialNotes.forEach( async (note) => {
  //   let noteObject = new Note(note)
  //   await noteObject.save()
  //   console.log('saved')
  // })
  // console.log('done')
})
describe('when thre is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    console.log('entered test')
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

})

describe('viewing a specific note', () => {
  test('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDB()
    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultNote.body).toEqual(noteToView)
  })

  test('fails with status 404 if note does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()
    await api
      .get(`/api/notes/${validNonExistingId}`)
      .expect(404)
  })

  test('fails with status 400 if id does not exist', async () => {
    const invalidId = '5a3d5da59070081a82a3445'
    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new note', () => {
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
  test('fails with status code 400 if data is invalid', async () => {
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
})

describe('deletion of a note', () => {
  test('succeed with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDB()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDB()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)

    const content = notesAtEnd.map(r => r.content)
    expect(content).not.toContain(noteToDelete.content)

  })

})

afterAll(async () => {
  await mongoose.connection.close()
})