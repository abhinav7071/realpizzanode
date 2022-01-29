const express = require('express');
const app = express();//ye ek express function hh first line me usko execute kre app me dalenge...
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');

const PORT = process.env.PORT || 9000;

//Assets : ye btata ki css and js kaha se uthani h...
app.use(express.static('public'));

//set template engine
app.use(expressLayout);
app.set('views',path.join(__dirname,'/resources/views'));
app.set('view engine','ejs');

app.get('/',(req,res) => {
    //res.send('Hellosss');
    res.render('home')
})

app.get('/cart',(req,res) => {
    res.render('customers/cart');
})

app.get('/login',(req,res) => {
    res.render('auth/login');
})

app.get('/register',(req,res) => {
    res.render('auth/register');
})

app.listen(PORT,() => {
    console.log(`Listening on the port ${PORT}`)
})