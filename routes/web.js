const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const guest = require('../app/http/middleware/guest');


function initRoutes(app){

    app.get('/',homeController().index);

    app.get('/cart',cartController().index);

    app.get('/login',guest,authController().login);
    app.post('/login',authController().postLogin);

    app.get('/register',guest,authController().register);
    app.post('/register',authController().postRegister);

    app.post('/logout',authController().logout);

    app.post('/update-cart',cartController().update);
    // app.get('/',(req,res) => {
    //     res.render('home')
    // })

    // app.get('/cart',(req,res) => {
    //     res.render('customers/cart');
    // })

    // app.get('/login',(req,res) => {
    //     res.render('auth/login');
    // })
    
    // app.get('/register',(req,res) => {
    //     res.render('auth/register');
    // })
    
}

module.exports = initRoutes;