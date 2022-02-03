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
const Emitter = require('events');



//Database connection
try{
    const url = process.env.MONGO_CONNECTION_URL;
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

//Event emmitter

const eventEmitter = new Emitter();
app.set('eventEmitter',eventEmitter);//is se puri application me kahin pe bhi eventEmiiter acces kr payenge, eventEmitter app se bind kiya



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
//for 404 page
app.use((req,res) => {
    res.status(404).render('errors/404')
})



const server = app.listen(PORT,() => {
    console.log(`Listening on the port ${PORT}`)
})

//Socket

const io = require('socket.io')(server);
io.on('connection',(socket) => {
    //console.log(socket.id);
    //ayah app.js se jo join methoda bheja vo recieve kiye.aur next ek callback me vo order id pass kra di aur ek room create krke usme joi kara denge socket.join() socket k join k methhod se

    socket.on('join',(orderId) => {
        console.log(orderId);
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated',(data) => {
    io.to(`order_${data.id}`).emit('orderUpdated',data);//yaha pe room h uske andar msg ko emit krna h..,abhi msg kr rhe socket k updar ..on se socket pe..aur to se socket k andar k room pe emit kr rhe msg

})

//order place emitter
eventEmitter.on('orderPlaced',(data) => {
    io.to(`adminRoom`).emit('orderPlaced',data);//yaha pe room h uske andar msg ko emit krna h..,abhi msg kr rhe socket k updar ..on se socket pe..aur to se socket k andar k room pe emit kr rhe msg

})
