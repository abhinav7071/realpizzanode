function cartController(){
     return{
                index(req,res){
                    res.render('customers/cart');
                },

                update(req,res){
                    //phli baar me cart create krke ,session me cart ka structure dala
                    if(!req.session.cart){
                        req.session.cart = {
                            items : {},
                            totalQty: 0,
                            totalPrice: 0
                        }
                    }

                    let cart = req.session.cart;
                    //check if items does not exits in cart
                    if(!cart.items[req.body._id]){
                        cart.items[req.body._id] = {
                            item:req.body,
                            qty:1
                        }

                        cart.totalQty = cart.totalQty + 1;
                        cart.totalPrice = cart.totalPrice + parseInt(req.body.price);

                    }  else{
                        cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
                        cart.totalQty = cart.totalQty + 1;
                        cart.totalPrice = cart.totalPrice + parseInt(req.body.price);
                    } 
                    
                    return res.json({ totalQty:req.session.cart.totalQty });
                   //return res.json({data:'All ok'}); 
                }
     }
}

module.exports = cartController;