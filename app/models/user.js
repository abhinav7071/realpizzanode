const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    
    name :{ type:String,required:true },
    email :{ type:String,required:true, unique:true },
    password :{ type:String,required:true },
    role :{ type:String,default:'customer' }
},{timestamps:true})

//ye ek tarike ka document ya blueprint bana, ise mongose.model me pass krenge tb humara collection banaga

module.exports = mongoose.model('User',userSchema);

