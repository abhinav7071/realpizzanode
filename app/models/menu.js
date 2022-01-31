const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    
    name :{ type:String,required:true },
    image :{ type:String,required:true },
    price :{ type:String,required:true },
    size :{ type:String,required:true }
})

//ye ek tarike ka document ya blueprint bana, ise mongose.model me pass krenge tb humara collection banaga
const Menu = mongoose.model('Menu',menuSchema);
module.exports = Menu;

//module.exports = mongoose.model('Menu',menuSchema);

