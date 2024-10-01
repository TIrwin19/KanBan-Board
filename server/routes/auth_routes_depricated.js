const user_router = require('express').Router();
const { sign, verify } = require('jsonwebtoken');
const User = require('../models/User.js')

function createToken(user) {
  return sign({ id: user._id }, process.env.JWT_SECRET)
}

//get user by id
user_router.get('/', async (req, res) => {
  try {
    const token = req.cookies?.token
    if (!token) {
      return res.json({ user: null })
    }

    const data = verify(token, process.env.JWT_SECRET)//verify token

    const user = await User.findById(data.id)
    res.json({ user: user })
  } catch (err) {
    console.log(err)
    res.json({ message: 'NUH UH: ', err })
  }
})


//register user
// user_router.post('/register', async (req, res) => {
//   try {
//     const newUser = await User.create(req.body)
//     const token = createToken(newUser)
//     res.cookie('token', token, { httpOnly: true })//httpOnly prevents access to the cookie from the client side
//     await newUser.save()
//     res.status(201).send(newUser)


//   } catch (err) {
//     if (err.name === 'ValidationError') {
//       const validationErr = err.errors

//       const errorMessage = Object.keys(validationErr)
//         .map((key) => `${key} is required`)
//         .join(", ")
//       res.status(400).send({ message: errorMessage })
//     } else {
//       res.status(500).send(error)
//     }
//   }
// })

//register user
user_router.post('/register', async (req, res) => {
  try {
    const newUser = await User.create(req.body)
    const token = createToken(newUser)
    await newUser.save()

    // Send token in the response instead of setting the cookie
    res.status(201).send({ user: newUser, token })
  } catch (err) {
    if (err.name === 'ValidationError') {
      const validationErr = err.errors
      const errorMessage = Object.keys(validationErr)
        .map((key) => `${key} is required`)
        .join(", ")
      res.status(400).send({ message: errorMessage })
    } else {
      res.status(500).send(error)
    }
  }
})

//login
user_router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).send({ message: 'User not found' })
    }
    const isMatch = await user.validatePass(password)
    if (!isMatch) {
      return res.json({ message: 'Invalid credentials' })
    }
    const token = createToken(user)

    // Send token in the response instead of setting cookie
    res.send({ user, token })
  } catch (err) {
    res.status(500).send(err)
  }
})




//login
// user_router.post('login', async (req, res) => {
//   try {
//     const { username, password } = req.body
//     const user = await User.findOne({ username })
//     if (!user) {
//       return res.status(404).send({ message: 'User not found' })
//     }
//     const isMatch = await user.validatePass(password)
//     if (!isMatch) {
//       return res.json({
//         message: 'Invalid credentials'
//       })
//     }
//     const token = createToken(user)
//     res.cookie('token', token, { httpOnly: true })
//     res.send(user)//send user back to client
//   } catch (err) {
//     res.status(500).send(err)
//   }
// })

//logout
user_router.post('/logout', (req, res) => {
  res.clearCookie('token').send({ message: 'Logged out' })
})

//auth
function isAuth(req, res, next) {
  const token = req.cookies?.token
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized get ur self a token' })
  }

  try {
    const data = verify(token, process.env.JWT_SECRET)

    if (!data) {
      return res.json({ message: 'Unauthorized' })
    }

    req.user = data // set the user data in the request object
    next()

  } catch (err) {
    res.json({ message: 'Unauthorized', err })
  }
}

user_router.use(isAuth)

module.exports = user_router