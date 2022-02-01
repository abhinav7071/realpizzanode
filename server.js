require('dotenv').config();
const express = require('express');
const app = express();//ye ek express function hh first line me usko execute kre app me dalenge...
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const PORT = process.env.PORT || 9000;
const flash = require('express-flash');
const passport = require('passport');
const MongoDbStore = require('connect-mongo')(session);



//Database connection
try{
    const url = 'mongodb://localhost/pizza';
    const conn =  mongoose.connect(url,{
        useNewUrlParser: true,
        useUnifiedTopology:true
    })
    console.log(`Mongodb database connected..!!`);
} catch(error){
    console.log(`error..: ${error.message}`,bgRed.white);
}


//Session Store
const url = 'mongodb://localhost/pizza';
const connection =  mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology:true
})
let mongoStore = new MongoDbStore({
        mongooseConnection : mongoose.connection,
        collection : 'sessions'
})


//Session config
app.use(session({
    secret : process.env.COOKIE_SECRET,
        resave:false,
        store: mongoStore,
        saveUninitialized: false,
        cookie: {maxAge : 1000 * 60 * 60 * 24 }// 24 hours
}))

//Passport config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());//passport ko initailize krengee...
app.use(passport.session());//passport session ki madad se kaam krtaa hai

app.use(flash());

// //Assets : ye btata ki css and js kaha se uthani h...
 app.use(express.static('public'));
 app.use(express.urlencoded({ extended: false }));//form ka data recieve krne k liye url se data recieve  krne k liye
 app.use(express.json());//enable kr rhe ki jo bhi json data server se aaye vo accept kr le
 

 //Set GLobal Session
 app.use((req,res,next) => {
    res.locals.session = req.session;//hume session ab avail hoga, kyunki session ko mount kr diya h response pe..
    res.locals.user = req.user;//user ko set krengee
    next()
 })

//set template engine
app.use(expressLayout);
app.set('views',path.join(__dirname,'/resources/views'));
app.set('view engine','ejs');

require('./routes/web')(app);//calling routes file web.js aur usme sare routes define krenge, app ka instance pass kiya



app.listen(PORT,() => {
    console.log(`Listening on the port ${PORT}`)
})