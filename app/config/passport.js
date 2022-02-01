    const LocalStrategy =  require('passport-local').Strategy
    const User = require('../models/user');
    const bcrypt = require('bcrypt');


    function init(passport){

        passport.use(new LocalStrategy({ usernameField: 'email' },async (email,password,done) => {
            //Login
            
            //check if email exists
            const user = await User.findOne({email:email});
            if(!user){
                return done(null,false,{ message : 'No user with this email' });

            }

            bcrypt.compare(password,user.password).then((match)=> {
                
                if(match){
                    return done(null,user,{message : 'Loggin Successfully' });
                } 
                //ager match ni hota h to

                return done(null,false,{message : 'Wrong username or password' });

            }).catch((err) => {
                return done(null,false,{message : 'Something went wrong' });
            })

        }));

        //agar user login ho gya to session k andar kuch store krne k liye aur user hum edone me mil jayega..yaha pe session me stor kiya h data
        passport.serializeUser((user, done) => {

            done(null,user._id);
        })

        //ab kya krenge session kk data ko get kaise krne hai
        passport.deserializeUser((id,done) => {
            User.findById(id, (err,user) => {

                done(err,user);
            });
        })
    }

    module.exports = init;