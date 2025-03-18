const User = require("../models/user")
const jwt = require("jwt-simple")
const bcrypt = require("bcrypt")
const config = require("../config")

const tokenForUser = (user) => {
  const timestamp = new Date().getTime()
  return jwt.encode({
    sub: user.id,
    iat: timestamp,
    exp: timestamp + (60 * 60 * 24 * 7) // expires in 1 week
  }, config.secret)
}

exports.signin = async (req, res, next) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }
    const isValidPassword = await bcrypt.compare(req.body.password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" })
    }
    res.send({ user_id: user._id, token: tokenForUser(user) })
  } catch (error) {
    return next(error)
  }
}

exports.signup = async (req, res, next) => {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return res.status(422).json({ message: "Email and password are required" })
    }
    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    if (!isValidEmail) {
      return res.status(422).json({ message: "Invalid email address" })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(422).json({ message: "Email is already in use" })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ email, password: hashedPassword })
    await user.save()
    res.json({ user_id: user._id, token: tokenForUser(user) })
  } catch (error) {
    return next(error)
  }
}