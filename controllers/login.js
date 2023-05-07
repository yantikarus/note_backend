const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  //destructure the req.body and extract username and password
  const { username, password } = req.body
  console.log(username, password)

  //find the user in the db
  const user = await User.findOne({ username: req.body.username }).exec()
  console.log('the user is ', user)
  //if user exist in db compare password and save it as correct pass variable
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
    // if user and password are incorrect return these
  if(!(user &&passwordCorrect)){
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }
  //if above correct create Token first define the username and id then send it to jwt
  //token contains the username and user id in a digitally signed form
  const userForToken = {
    username : user.username,
    id:user._id,
  }
  //create JWT token
  const token = jwt.sign(userForToken, process.env.SECRET)
  //send teh status and the token along with username and name
  res.status(200).send({ token, username: user.username, name:user.name })
})

module.exports = loginRouter