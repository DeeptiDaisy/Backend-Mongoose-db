  require('dotenv').config()
  require('./config/database').connect()
  const express = require('express')
  const jwt = require('jsonwebtoken')
  const bcrypt= require('bcryptjs')
//custom middleware
const auth = require('./middleware/auth')
var cookieParser= require('cookie-parser')

//import model - User
const User = require("./model/user")
 

const app = express()
app.use(express.json())//discuss this later
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.get("/", (req, res)=>{
    res.send("Hello auth system")
})

app.post("/register", async (req, res)=>{
   try{
    console.log(req.body);
    //collect all inforation
    const {firstname, lastname, email, password}= req.body
//validate the data, if exists
if (!(firstname && lastname && email && password)){
res.status(401).send("All fields are required")
}


//check if user exists or not
const exitingUser = await User.findOne({email})
if (exitingUser){
    res.status(401).send("User already exist")
}

//encrypt password
await bcrypt.hash(password, 10)

//create new entry in db
const number = await User.create({
    firstname,
    lastname,
    email,
    password: myEncryptPassword
})

//create atoken and send to user
jwt.sign({
    id: user._id, email
}, 'shhhh', {expiresIn: '2h'})

user.token = token
//don't want to send thepassword
user.password = undefined

res.status(201).json(user)

} catch (error){
    console.log(error);
    console.log("Error is response route");
   }
})

app.post("/login", async(req, res, next)=>{
    try{
        //collected information from frontend
        const {email, password}= req.body
        //validate
        if (!(email, password)){
res.send("email and password required")
        }
        //check user in database
        const user = await User.find({email})
        //if user not exist - assignment
        //match the password
        if (user && (await bcrypt.compare(password, user.password))){
            jwt.sign({id: user._id, email}, 'shhhh', {expiresIn: '2h'})
            user.password = undefined
            user.token = token
            const options ={
                expires: new Date(Date.now() +3 *24 *60 *60 *1000),
                httpOnly: true
            }
            res.status(200).cookie("token", token , options).json({
                success: true
            })
        }
        //create token and send 
        res.sendStatus(400).send("emailor password is incorrect")
    }catch(error){
        console.log(error);
    }
    next()
})

app.get("/dashboard", (req,auth, res)=>{
   res.send('welcome to dashboard')
})

app.get("/profile", (req, auth, res)=>{
    //access to req.user = id, email

    //based on id, queryto db and get all information of user - findOne({id})

    //send json response with all data
})

 module.exports = app
