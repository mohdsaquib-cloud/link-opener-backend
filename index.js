const db = require('./database/db')
var cors = require('cors')
const express = require('express')
const app = express()
const auth = require('./routes/auth')
const bot = require('./routes/bot')
const session = require('express-session')
var DiscordStrategy = require('passport-discord').Strategy
const passport = require('passport');
var scopes = ['identify', 'email', 'guilds', 'guilds.join'];
const DiscordUser =  require('./models/DiscordUser')
const config = require("config")
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// io.on('connection', function(socket) {
//     //    console.log('A user connected');
//        socket.on('setUsername', function(data) {
//           if(users.indexOf(data) > -1) {
//              socket.emit('userExists', data + ' username is taken! Try some other username.');
//           } else {
//              users.push(data);
//              console.log(users);
//              socket.emit('userSet', {username: data});
//           }
//        });
       
//        socket.on('msg', function(data) {
//           //Send message to everyone
//           io.sockets.emit('newmsg', data);
//        })
//     });
// let user = {
//     name:"saquib",
//     email:"mohdsaquib9876@gmail.com"
// }
let user = {}
passport.serializeUser((user,done)=>{    
    done(null,user.discordId)
})
passport.deserializeUser(async (id,done)=>{
    const user = DiscordUser.findById(id)
    if(user)
        done(null,user)  
})
passport.use(new DiscordStrategy({
    clientID:config.get("CLIENT_ID"),
    clientSecret:config.get('CLIENT_SECRET'),
    callbackURL:config.get("CLIENT_REDIRECT"),
    scope: scopes
}, async(accessToken, refreshToken, profile, done) => {
    user = {...profile}      
    try{
        const user = await DiscordUser.findOne({discordId:profile.id})
        if(user){
            done(null,user)
        }else{
            const newUser = await DiscordUser.create({
                discordId :profile.id,
                username:profile.username
            })
            const saveUser = await newUser.save();
            console.log("User",saveUser)
            done(null,saveUser)
        }
    }catch(err){
        console.log(err)
        done(err,null)
    }
}));

// Database Connection
db.then(()=>console.log('Connected to MongoDB')).catch((err)=>console.log(err))

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
app.use(session({
    secret:'some randomn key',
    cookie:{
        maxAge:60000 * 60 * 24
    },
    resave: true,
    saveUninitialized: true,
    name : 'discord-oauth2'
}))
app.use(passport.initialize())
app.use(session())


//Routes Middleware
app.use('/auth',auth)
app.use('/bot',bot)

//app Routes
app.get("/",(req,res)=>{
   res.send("Working")
})
app.get("/user",(req,res)=>{
    res.send(user)
})

//PORT
PORT = 5000
app.listen(PORT ,()=>{
    console.log(`Listening on port ${PORT}`)
})