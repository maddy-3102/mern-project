const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

//===== GENERATING TOKENS =====
userSchema.methods.generateAuthToken = async function(){
    try{
       const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);

       this.tokens = this.tokens.concat({token:token});
       await this.save();

       console.log(token);
       return token;
    }
    catch(error){
        res.send("the error part" + error);
        console.log("the error part" + error);
    }
}


// ===== HASHING ======
userSchema.pre("save",async function(next){
if(this.isModified("password")){

    this.password = await bcrypt.hash(this.password,10);
    this.confirmpassword = await bcrypt.hash(this.password,10);
}
    next();
})

const Register = new mongoose.model("Register",userSchema);
module.exports = Register;