// const mongoose = require('mongoose')

// if(process.argv.length<3){
//   console.log('give password as argument')
//   process.exit(1)
// }
// // when we run the file with node mongo.js #password the password is process.argv[2]
// const password = process.argv[2]

// // change the databasename by inserting it after mongodb.net
// const url = `mongodb+srv://wsutr:${password}@cluster0.vu3tk4f.mongodb.net/noteApp?retryWrites=true&w=majority`

// mongoose.set('strictQuery', false)
// mongoose.connect(url)

// // after establishing the connection, we define the schema fro a note and teh matching model
// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// const Note = mongoose.model('Note', noteSchema)

// // const note = new Note({
// //     content: 'HTML is Easy',
// //     important: true,
// // })
// Note.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })

// // note.save().then(result => {
// //     console.log('note saved!')
// //     mongoose.connection.close()
// // })