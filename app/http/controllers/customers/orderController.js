const Order = require('../../../models/order');
const moment = require('moment');

function orderController(){
     return{
                
                store(req,res){

                    //Validate Request
                    const {phone, address} = req.body;

                    if(!phone || !address){
                        req.flash('error', 'All fields are required');
                        return res.redirect('/cart');
                    }

                    const order = new Order({
                        customerId : req.user._id,
                        items : req.session.cart.items,
                        phone : phone,
                        address: address
                    })

                    order.save().then(result => {
                        Order.populate(result,{path : 'customerId' },(err,placeOrder) => {
                            delete req.session.cart
                            //Emit event
                            const eventEmitter = req.app.get('eventEmitter');
                            eventEmitter.emit('orderPlaced',placeOrder );
                            req.flash('success', 'Order placed successfully');
                            return res.redirect('/customer/orders');
                        })
                        // delete req.session.cart
                        // //Emit event
                        // const eventEmitter = req.app.get('eventEmitter');
                        // eventEmitter.emit('orderPlaced',result );
                        // req.flash('success', 'Order placed successfully');
                        // return res.redirect('/customer/orders');
                    }).catch((err) => {
                        req.flash('error', 'Something went wrong');
                        return res.redirect('/cart');
                    })
                    
                },

                async index(req,res){
                    const orders = await Order.find({customerId: req.user._id},
                        null,
                        {sort : {'createdAt': -1}});
                    //is se rokenge page pe vapas back aye to error alert na aaye
                    res.header('Cache-Control', 'no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0')
                    res.render('customers/orders',{ orders: orders, moment: moment });
                },

                async show(req,res){

                    const order = await Order.findById(req.params._id);

                    //Authorised User ki usii user ka order hh jo login in h
                    if(req.user._id.toString() === order.customerId.toString() ){
                        return res.render('customers/singleOrder',{ order: order });
                    } else {
                        return res.redirect('/');
                    }
                },

                
     }
}

module.exports = orderController; 