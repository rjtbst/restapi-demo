const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  address:{
   type: String,
   required: true,
  },
  date:{
    type:Date,
    default:Date.now
  },
  messages:[
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    }
  ],
  tokens: [
   {
    token:{
      type: String,
      required: true
    }
   }
  ]
});

//hashing
// models have pre and post  that takes 2 params -type of event(init, validate,save, remove)
// 2nd param is a callback that is executed with this referncing the model instance
//as a middleware

userSchema.pre('save', async function(next){
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = await bcrypt.hash(this.confirmPassword,12); 
  }
  next();
});

//creating token
userSchema.methods.generateAuthToken = async function() {
  try{
    let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({token:token})
    await this.save();
    return token;
  }catch(err){
    console.log(err);
  }
}


//store message
userSchema.methods.addMessage = async function(name, email, phone, message){
  try{
   this.messages = this.messages.concat({name, email, phone, message});
   await this.save();
   return this.messages
  }catch(error){
    console.log(error);
  }
}

const User = mongoose.model("USER", userSchema);

module.exports = User;
