const User = require('../../models/user');
const flash = require('express-flash');
const bcrypt = require('bcrypt');
const passport = require('passport');


function authController(){
    //private method h isi controller me call hoga sirf, redirection url h role k base pe
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }

     return{
         
                login(req,res){
                    res.render('auth/login');
                },
                
                register(req,res){
                    res.render('auth/register');
                },

                async postRegister(req,res){
                    const {name,email,password} = req.body;
                    //console.log(req.body);

                    /****Validate****/
                    if(!name || !email || !password){
                        req.flash('error','All fields are required.');
                        req.flash('name',name);
                        req.flash('email',email);
                        return res.redirect('/register');
                    }

                    /**Check email exits***/
                    User.exists({ email: email },(err,result)=>{

                        if(result){
                            req.flash('error','Email already exits.');
                            req.flash('name',name);
                            req.flash('email',email);
                            return res.redirect('/register');
                        }
                    })

                    /***Create User***/
                    
                    //Hash password
                    const hashedPassword = await bcrypt.hash(password,10);

                    const user = new User({
                        name: name,
                        email: email,
                        password: hashedPassword
                    })

                    user.save().then((user) => {
                        //login
                        res.redirect('/login');

                    }).catch(err=>{
                        req.flash('error','Something went wrong..!!');
                        return res.redirect('/register');
                    })

                },

                async postLogin(req,res,next){
                    const {email,password} = req.body;

                    //Validate request
                    if(!email || !password){
                        req.flash('error','All fields are required');
                        return res.redirect('/login');
                    }
                    
                    passport.authenticate('local',(err,user,info) => {

                        //agr error h to
                        if(err){
                            req.flash('error',info.message);
                            return next(err);
                        }

                        //agr user ni h
                        if(!user){
                            req.flash('error',info.message);
                            return res.redirect('/login');
                        }

                        req.logIn(user,(err)=>{

                            if(err){
                                req.flash('error',info.message);
                                return next(err);
                            }

                            //return res.redirect('/');
                            return res.redirect(_getRedirectUrl(req));
                        })
                    })(req,res,next)
                },

                logout(req,res){
                    req.logout();
                    return res.redirect('/login')
                }
     }
}

module.exports = authController;