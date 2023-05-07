const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')



usersRouter.get('/', async (req, res) => {
  // get all the users from db
  const users = await User
  //mongo syntax 1 to only include content and important
    .find({}).populate('notes', { content:1, important:1 })
  //send the result as json
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  //destructuring request body
  const { username, name, password } = req.body
  console.log(req.body)
  //salt setting to jammble up the password
  const saltRounds = 10
  //hashing the password using the salt and take the password from req.body
  const passwordHash = await bcrypt.hash(password, saltRounds)
  //create user object from User model  (username and name are from the body, while the has are the hased password)
  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  console.log('user router , saving...', savedUser)
  //send the status code of 201 and the saved user
  res.status(201).json(savedUser)

})



module.exports = usersRouter