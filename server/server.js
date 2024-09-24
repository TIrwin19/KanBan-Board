require('dotenv').config() //this reads our .env file and parses it into our code whenever we use DB_whatever as a key
const express = require('express')
const http = require('http')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4') //this helps us to use apollo server with express 
const mongoose = require('mongoose')
const { typeDefs, resolvers } = require('./graphql/schema')

import path from "path";
//REMEMBER TO MAKE client.js underr config folder (mongoose.connect shit)
const client = require('./config/client')




//initialize express app
const app = express() // creating an express app , it acts as the core of the server


//CORS middleware
app.use(cors({
    origin: process.env.CLIENT_URL, //allow request from the specified client(frontend)
    credentials: true, // allow credentials like cookies to be passed with requests from the frontend
}))

//cookie parser middleware
app.use(cookieParser())// This allows the server to read and parse cookies sent in requests. It's particularly important if you're handling user sessions/authentication via cookies.

//body parser for JSON
app.use(express.json()) // Built-in middleware to parse incoming JSON request bodies, which is commonly used in modern APIs (e.g., GraphQL or REST APIs).


// initialize apollo server
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
})

// start apollo server
async function startApolloServer() {
    await apolloServer.start() // Starts the Apollo Server asynchronously. This is necessary because some parts (like schema validation) need to happen before it's ready to accept requests.


    //integrating apollo server with express app at the /graphql endpoint
    app.use('/graphql', expressMiddleware(apolloServer)) // This makes GraphQL queries available at the `/graphql` endpoint of the Express app.


    //start express server
    const server = http.createServer(app) // Creating a raw HTTP server. While Express already works as a web server, this gives you more control over low-level operations if needed (like WebSockets).


    const PORT = process.env.PORT || 5173

    server.listen(PORT, () => { // listen requests on the specified port
        console.log(`Server running on port ${PORT}`)
    })
}


//mongodb connection and call "startApolloServer"
// Mongoose connection is asynchronous, so we wait until it's ready before starting the server
mongoose.once('open', () => { // `once` is an event listener that triggers when MongoDB is successfully connected.
    console.log('connected to mongodb')
    startApolloServer() // After MongoDB is connected, the Apollo and Express servers are started.
})

mongoose.on('error', (err) => {
    console.error('mongodb connection error', err)
})


//.env must do list: CLIENT_URL , PORT , DB_NAME  example:
/*
PORT=4000
DB_NAME=your-db-name
CLIENT_URL=http://localhost:3000
*/
