const express = require('express');
const app = express();//ye ek express function hh first line me usko execute kre app me dalenge...
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');

const PORT = process.env.PORT || 9000;

//Assets : ye btata ki css and js kaha se uthani h...
app.use(express.static('public'));

app.get('/',(req,res) => {
    //res.send('Hellosss');
    res.render('home')
})


//set template engine
app.use(expressLayout);
app.set('views',path.join(__dirname,'/resources/views'));
app.set('view engine','ejs');


app.listen(PORT,() => {
    console.log(`Listening on the port ${PORT}`)
})