require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// serve static files (e.g. images) from the public directory
app.use('/static', express.static(`${__dirname}/public`))

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// a route to handle fetching the content of the About Us page
app.get('/about', (req, res) => {
  res.json({
    name: 'Kumneger Matewos',
    imageUrl: `${req.protocol}://${req.get('host')}/static/images/kumneger.jpg`,
    paragraphs: [
      "Hi, I'm Kumneger Matewos, a junior at NYU Abu Dhabi majoring in Computer Science with a minor in Mathematics.",
      "I love building things, and just as much, breaking them to see how they work. I'm not sure the two are connected, but my other big love is music. I'm currently learning to play the guitar.",
      "As for my goals: I hope to become filthy rich without becoming famous. I also want to do more than just play a few instruments, like the guitar, the piano and the drums. I want to be able to truly speak through them.",
      'Fun fact: when I was five years old, I wandered out of the house on my own. A woman found me on the street and took me in, and I stayed with her for about three days while my whole family searched for me. My mom reported me missing to the police on the very first day, and the woman who found me had also gone to the police. The catch? They had gone to two different police stations! It took until the third day for the stations to connect the two reports, and I was finally reunited with my family.',
    ],
    status: 'all good',
  })
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
