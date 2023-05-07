const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

describe('when there is initially one user in db', () => {
  //initialized test db with a root user
  beforeEach( async() => {
    //clear all the user
    await User.deleteMany({})
    //create hashed password with bcrypt
    const passwordHash = await bcrypt.hash('sekret', 10)
    //create root user
    const user = new User({ username: 'root', passwordHash })
    //save it to database
    await user.save()
  })

  // test('creating succeeds with a fresh username', async () => {
  //   //get all the user from DB ( should be only one root)
  //   const usersAtStarts = await helper.usersInDb()
  //   console.log("the user at starts is ", usersAtStarts)
  //   //add a new user
  //   const newUser = {
  //     username: 'macalada',
  //     name: 'cucimaca',
  //     password: 'bubuci'
  //   }
  //   //then post it
  //   await api
  //     .post('/api/users')
  //     .send(newUser)
  //     .expect(201)
  //     .expect('Content-Type', /application\/json/)
  //   //check in DB if that user added
  //   await new Promise(resolve => setTimeout(resolve, 5000));
  //   const usersAtEnd = await helper.usersInDb()
  //   console.log(usersAtEnd)
  //   //check if users at end have length start +1
  //   expect(usersAtEnd).toHaveLength(usersAtStarts.length +1)
  //   //also check if the username contain new username
  //   const usernames = usersAtEnd.map(u => u.username)
  //   console.log('the usernames are ', usernames)
  //   expect(usernames).toContain(newUser.username)
  // },10000)

  test('creation fails with proper statuscode and message if username already taken', async () => {
    //get all users at starts
    const usersAtStarts = await helper. usersInDb()
    console.log('users at stars', )
    //create new test user with same username
    const newUser = {
      username: 'root',
      name: 'superuser',
      password: 'bubuci',
    }
    //post it and expect 400
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    console.log('the result is ', result)

    expect(result.body.error).toContain('User validation failed')
    const usersAtEnd = await helper.usersInDb()
    console.log('user at end', usersAtEnd)
    expect(usersAtEnd).toEqual(usersAtStarts)
  })
})