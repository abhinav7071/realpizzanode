const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const AdminOrderController = require('../app/http/controllers/admin/orderController');
const AdminStatusController = require('../app/http/controllers/admin/statusController');
//Middlewares
const guest = require('../app/http/middleware/guest');
const auth = require('../app/http/middleware/auth');
const admin = require('../app/http/middleware/admin');


function initRoutes(app){

    app.get('/',homeController().index);

    app.get('/cart',cartController().index);

    app.get('/login',guest,authController().login);
    app.post('/login',authController().postLogin);

    app.get('/register',guest,authController().register);
    app.post('/register',authController().postRegister);

    app.post('/logout',authController().logout);

    app.post('/update-cart',cartController().update);

    app.post('/orders',auth,orderController().store);
    app.get('/customer/orders',auth,orderController().index);
    app.get('/customer/orders/:_id',auth,orderController().show);

    /***Admin routes***/
    app.get('/admin/orders',admin,AdminOrderController().index);

    app.post('/admin/order/status',admin,AdminStatusController().update);

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