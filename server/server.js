require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const mongoose = require("./config/client");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typedefs");
const { verifyToken } = require('./utils/token')

// Initialize express app
const app = express();

// CORS middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

// Cookie parser middleware
app.use(cookieParser());

// Body parser for JSON
app.use(express.json());

// Start Apollo Server
async function startApolloServer() {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req, res }) => {
            const authHeader = req.headers.authorization;
            let user = null;

            if (authHeader) {
                const token = authHeader.split(" ")[1];
                try {
                    const payload = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
                    user = await User.findById(payload.userId);
                } catch (err) {
                    console.log("Invalid token:", err.message);
                }
            }

            return { req, res, user }; // User gets passed to resolvers
        },
    });

    await apolloServer.start();

    app.use(
        "/graphql",
        expressMiddleware(apolloServer, {
            context: async ({ req, res }) => ({ req, res }),
        })
    );

    const server = http.createServer(app);
    const PORT = process.env.PORT || 5173;

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Mongoose connection
mongoose.once("open", () => {
    console.log("Connected to MongoDB");
    startApolloServer();
});

mongoose.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

// require('dotenv').config() //this reads our .env file and parses it into our code whenever we use DB_whatever as a key
// const express = require('express')
// const http = require('http')
// const cors = require('cors')
// const cookieParser = require('cookie-parser')
// const { ApolloServer } = require('@apollo/server')
// const { expressMiddleware } = require('@apollo/server/express4') //this helps us to use apollo server with express
// const mongoose = require('./config/client')
// const resolvers = require('./graphql/resolvers')
// const typeDefs = require('./graphql/typedefs')
// // const auth_router = require('./routes/auth_routes_test')
// const { router } = require('./routes/protected_routes')

// const generateAccessToken = (user) => {
//     return jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
//         expiresIn: "15m",
//     });
// };

// // Generate Refresh Token
// const generateRefreshToken = (user) => {
//     return jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
//         expiresIn: "7d",
//     });
// };

// //initialize express app
// const app = express() // creating an express app , it acts as the core of the server

// //CORS middleware
// app.use(cors({
//     origin: process.env.CLIENT_URL, //allow request from the specified client(frontend)
//     credentials: true, // allow credentials like cookies to be passed with requests from the frontend
// }))

// //cookie parser middleware
// app.use(cookieParser())// This allows the server to read and parse cookies sent in requests. It's particularly important if you're handling user sessions/authentication via cookies.

// //body parser for JSON
// app.use(express.json()) // Built-in middleware to parse incoming JSON request bodies, which is commonly used in modern APIs (e.g., GraphQL or REST APIs).

// // Use the authentication routes at the /auth endpoint
// // app.use('/auth', auth_router); // This integrates the authentication routes for registration, login, logout, etc.

// // middleware for protected routes
// app.use('/protected', router)

// app.post("/refresh_token", (req, res) => {
//     const token = req.cookies.jid;
//     if (!token) {
//         return res.send({ ok: false, accessToken: "" });
//     }

//     let payload = null;
//     try {
//         payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
//     } catch (err) {
//         return res.send({ ok: false, accessToken: "" });
//     }

//     // Token is valid, issue a new access token
//     const user = User.findById(payload.userId);
//     if (!user) {
//         return res.send({ ok: false, accessToken: "" });
//     }

//     const accessToken = generateAccessToken(user);
//     return res.send({ ok: true, accessToken });
// });

// app.post("/logout", (req, res) => {
//     res.clearCookie("jid", { path: "/refresh_token" });
//     return res.send({ ok: true });
// });

// // start apollo server
// async function startApolloServer() {
//     // initialize apollo server
//     const apolloServer = new ApolloServer({
//         typeDefs,
//         resolvers,
//     });

//     await apolloServer.start(); // Starts the Apollo Server asynchronously. This is necessary because some parts (like schema validation) need to happen before it's ready to accept requests.

//     //integrating apollo server with express app at the /graphql endpoint

//     app.use(
//         "/graphql",
//         cors({
//             origin: process.env.CLIENT_URL, // Allow request from the specified client (frontend)
//             credentials: true, // Allow credentials like cookies to be passed with requests from the frontend
//         }),
//         expressMiddleware(apolloServer, {
//             context: async ({ req, res }) => ({ req, res }), // Set context if you need access to req or res in resolvers
//         })
//     );

//     //start express server
//     const server = http.createServer(app); // Creating a raw HTTP server. While Express already works as a web server, this gives you more control over low-level operations if needed (like WebSockets).

//     const PORT = process.env.PORT || 5173;

//     server.listen(PORT, () => {
//         // listen requests on the specified port
//         console.log(`Server running on port ${PORT}`);

//     });
// }

// //mongodb connection and call "startApolloServer"
// // Mongoose connection is asynchronous, so we wait until it's ready before starting the server
// mongoose.once('open', () => { // `once` is an event listener that triggers when MongoDB is successfully connected.
//     console.log('connected to mongodb')
//     startApolloServer() // After MongoDB is connected, the Apollo and Express servers are started.
// })

// mongoose.on('error', (err) => {
//     console.error('mongodb connection error', err)
// })
