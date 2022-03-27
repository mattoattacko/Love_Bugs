const PORT = 8000;
const express = require('express');
const { MongoClient } = require('mongodb');
const { v1: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const uri = process.env.URI

const app = express()
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json('Yo dawg I heard you like json so I put json in your json');
})


// ***** Sign Up ***** //

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
      return res.status(409).send( 'User already exists' )      
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
    res.status(201).json({ token, userId: generatedUserId }) //email: sanitizedEmail too?

  } catch (error) {
    console.log(error)
  }
  finally {
    await client.close()
  }
})
 

// ***** Log-In ***** //

app.post('/login', async (req, res) => {
  const client = new MongoClient(uri)
  const { email, password } = req.body

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    //we go into the DB, into the collection of users, and search for the user by email
    const user = await users.findOne({ email })

    // once we have the user, we compare the PW they entered and the hashed PW and see if they match
    // we pass them to 'bcrypt.compare'.
    const correctPassword = await bcrypt.compare(password, user.hashed_password)

    // if the user exists and the PW is correct, we create a token for the user. Else we send them back an error.
    if (user && correctPassword) {
      const token = jwt.sign(user, email, {
        expiresIn: 60 * 24 // 24 hours
      })

      res.status(201).json({ token, userId: user.user_id })

    }

    res.status(400).json('Invalid email or password')
  } catch (error) {
    console.log(error)
  }
  finally {
    await client.close()
  }
})


// ***** Get Individual User Info ***** //

// we can reuse endpoints if its a different method
app.get('/user', async (req, res) => {
  const client = new MongoClient(uri)
  const userId = req.query.userId //we need to pass through the userId as a parameter. We do that in the Dashboard.

  // console.log('userId', userId)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users') //gets users colletion

    //we search for the user and all of their data by the userId.
    // which we passed through via params
    const query = { user_id: userId }

    //gets users collection and finds one user based on the query we wrote
    const user = await users.findOne(query)
    res.send(user)

  } finally {
    await client.close()
  }
})




// ***** Matches ***** //

app.get('/users', async (req, res) => {
  const client = new MongoClient(uri)
  const userIds = JSON.parse(req.query.userIds)

  // console.log(userIds)


  try {
    await client.connect()
    const database = client.db('app-data') 
    const users = database.collection('users')

    const pipeline = [
      {
        '$match': {
          'user_id': {
            '$in': userIds
          }
        }
      }
    ]
    
    const foundUsers = await users.aggregate(pipeline).toArray()

    res.send(foundUsers)
    
  } finally {
    await client.close()
  }
})


// ***** Get All Users (gendered) ***** //

// note: changed to get and filter the users by gender
// retrieves all data from the DB. 
// First makes a new MongoClient.
// for 'connect()', we pass in the DB we want to connect to.
// "database.collection('users')"" searches through the collection of users.
// "await users.toArray()" returns an array of all users in the collection.
// "res.send(returnedUsers)" sends the array of users to the client so we can display them in the browser. 
// We "await client.close" to make sure the client is closed before we exit the function.
app.get('/gendered-users', async (req, res) => {
  const client = new MongoClient(uri) 
  const gender = req.query.gender

  // console.log('gender', gender)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const query = { gender_identity: {$eq : gender} }
    const foundUsers = await users.find(query).toArray()

    res.send(foundUsers)
  } finally {
    await client.close()
  }
})

// ***** UpDate User ***** //
app.put('/user', async (req, res) => {
  const client = new MongoClient(uri)
  const formData = req.body.formData

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    //we look for a user by their formData.user_id (which we saved from cookies in OnBoarding)
    const query = { user_id: formData.user_id }

    //this is the data we want to add to the user
    const updateDocument = { 
      $set: {
        first_name: formData.first_name,
        dob_day: formData.dob_day,
        dob_month: formData.dob_month,
        dob_year: formData.dob_year,
        show_gender: formData.show_gender,
        gender_identity: formData.gender_identity,
        gender_interest: formData.gender_interest,
        url: formData.url,
        about: formData.about,
        matches: formData.matches,
      },
    }

    //we update by passing through the query defined and updated document
    const insertedUser = await users.updateOne(query, updateDocument)
    res.send(insertedUser)

  } finally {
    await client.close()
  }
})


// ***** Adds Match ***** //

app.put('/addmatch', async (req, res) => {
  const client = new MongoClient(uri)
  const { userId, matchedUserId } = req.body

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users') 

    //we look for ourselves (the user who is signed in) in the DB
    const query = { user_id: userId }

    //once we find them, we update the matches array by pushing the matchedUserId
    const updateDocument = { 
      $push: { matches: { user_id: matchedUserId }}, 
    }
    const user = await users.updateOne(query, updateDocument)
    res.send(user)
  } finally {
    await client.close()
  }
})


// ***** Messages ***** //

// for our query, we go into our message collection and we look for anything that has the from userId (the user who sent the message) and the "to_userId" (the user who received the message)
// we make an array out of everything that returns from our query
app.get('/messages', async (req, res) => {
  const client = new MongoClient(uri)
  const { userId, correspondingUserId } = req.query
  // console.log(userId, correspondingUserId)

  try {
    await client.connect()
    const database = client.db('app-data')
    const messages = database.collection('messages')

    const query = {
      from_userId: userId, to_userId: correspondingUserId
    }
    const foundMessages = await messages.find(query).toArray()
    res.send(foundMessages)
  } finally {
    await client.close()
  }
})


// ***** Chatting ***** //

// we pass through the message from rec.body
// we get our messages collection and insert one message we just passed through
app.post('/message', async (req, res) => {
  const client = new MongoClient(uri)
  const message = req.body.message

  try {
    await client.connect()
    const database = client.db('app-data')
    const messages = database.collection('messages')
    const insertedMessage = await messages.insertOne(message)
    res.send(insertedMessage)
  } finally {
    await client.close()
  }
})





























app.listen(PORT, () => console.log('server running on PORT ' + PORT));