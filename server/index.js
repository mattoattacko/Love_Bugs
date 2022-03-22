const PORT = 8000;
const express = require('express');
const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://matto:mattmatt7878@cluster0.k8dtk.mongodb.net/Cluster0?retryWrites=true&w=majority'

const app = express();

app.get('/', (req, res) => {
  res.json('Yo dawg I heard you like json so I put json in your json');
})

//sends data to our DB
app.post('/signup', (req, res) => {
  res.json('Yo dawg I heard you like json so I put json in your json');
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
  } finally {
    await client.close()
  }
})

app.listen(PORT, () => console.log('server running on PORT ' + PORT));