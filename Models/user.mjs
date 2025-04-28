
import mongoose from 'mongoose'
const userSchema = mongoose.Schema({
name:{
    type:String,
    required:true,
    minlength:2,
    maxlength:50
},

email:{
    type:String,
    required:true,
},
password:{
    type:String,
    required:true,
    minlength:3,
}

})
const userModel = mongoose.model('users', userSchema)
export default  userModel;