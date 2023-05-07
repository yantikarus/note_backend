const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
//first define the schema, what type of data each property
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  passwordHash : String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    console.log('the doc is ', document)
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    //we delete the pass
    delete returnedObject.passwordHash
  }
})


const User = mongoose.model('User', userSchema)



module.exports = User