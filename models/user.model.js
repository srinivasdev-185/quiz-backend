import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
        minlength:[5,'email must be 5 characters long']
    },
    password:{
        type:String,
        required:true
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    // username:{
    //     type:String,
    //     required:true
    // },
    role:{type:String,
        enum:['Admin','User','SuperAdmin','AdminRequest']
        ,default:'User'
    },
},{timestamps:true})

userSchema.pre('save',async function(){
    if(!this.isModified('password')){
        return ;
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})

userSchema.methods.comparePassword=async function(password){
    console.log(password);
    return bcrypt.compare(password,this.password);
}

export default mongoose.model('User',userSchema);