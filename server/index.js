const PORT = 8000;
const express = require('express');
const { MongoClient } = require('mongodb');
const { v1: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');

const uri = 'mongodb+srv://matto:mattmatt7878@cluster0.k8dtk.mongodb.net/Cluster0?retryWrites=true&w=majority'

const app = express()
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json('Yo dawg I heard you like json so I put json in your json');
})

// sends info to our DB
// we pass stuff via the 'body'
// we make this post request in "AuthModal.js" in the "handleSubmit" function in the Frontend. 
// in the 'handleSubmit' we are getting/sending the email and password the user wants to use
app.post('/signup', async (req, res) => {
  const client = new MongoClient(uri)

  // console.log(req.body)

  // email and password to send with the body
  // this is all a demonstration of how to pass data from the FE to the BE.
  const { email, password } = req.body;

  // we make a unique ID
  const generatedUserId = uuidv4()

  // we create a hashed pw
  const hashedPassword = await bcrypt.hash(password, 10)

  // Now we can send this over to our DB
  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    // checks if the users already exists
    const existingUser = await users.findOne({ email })

    if (existingUser) {
      return res.status(400).send( 'User already exists' )      
    }

    // sanitize the email for consistencies sake. 
    const sanitizedEmail = email.toLowerCase()

    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword
    }

    const insertedUser = await users.insertOne(data) // insertOne is a MongoDB method. Just like 'find' and 'connect'

    //we generate a token to check if the user is logged in to the app
    const token = jwt.sign(insertedUser, sanitizedEmail, { 
      expiresIn: 60 * 24  // 24 hours
    })

    // we send the token back to the FE
    res.status(201).json({ token, userId: generatedUserId, email: sanitizedEmail})
  } catch (error) {
    console.log(error)
  }

})

// retrieves all data from the DB. First makes a new MongoClient.
// for 'connect()', we pass in the DB we want to connect to.
// "database.collection('users')"" searches through the collection of users.
// "await users.toArray()" returns an array of all users in the collection.
// "res.send(returnedUsers)" sends the array of users to the client so we can display them in the browser. 
// We "await client.close" to make sure the client is closed before we exit the function.
app.get('/users', async (req, res) => {
  const client = new MongoClient(uri) 

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const returnedUsers = await users.find().toArray()
    res.send(returnedUsers)
  } catch (error) {
    console.log(error)
  }
})

app.listen(PORT, () => console.log('server running on PORT ' + PORT));