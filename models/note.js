// This module only defines Mongoose schema for notes
const mongoose = require('mongoose')
//define the schema and detail
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required:true,
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
//set the return object as jsonmodify the return object and delete unnecessary item
noteSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString()
    delete returnObject._id
    delete returnObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)