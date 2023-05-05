require("dotenv").config()
const express = require("express");
const hbs = require("hbs");
const bcrypt = require('bcryptjs');
const app = express();
const path = require("path")
const port = process.env.PORT || 3000;

require("./db/conn");
const Register = require("./models/registers")

const staticPath = path.join(__dirname,'../public');
console.log(staticPath);
const templatePath = path.join(__dirname,'../templates/views');
const commonsPath = path.join(__dirname,'../templates/common');

app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set("view engine","hbs");
app.set("views",templatePath);
hbs.registerPartials(commonsPath);

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",async(req,res)=>{
    try{
      const password = req.body.password;
      const cpassword = req.body.confirmpassword;
    //   console.log(req.body);
      if(password === cpassword){
          const register = new Register({
              name:req.body.name,
              email:req.body.email,
              phone:req.body.phone,
              gender:req.body.gender,
              password:req.body.password,
              confirmpassword:req.body.confirmpassword
          })
          
          console.log("the success part" + register)
          const token = await register.generateAuthToken();
          console.log("the token part" + token);

          console.log(register);
          const registered = await register.save();
          res.status(201).render("index");

      }
      else{
          res.status(400).send("passwords are not matching....");
      }

    }
    catch(e){
      res.status(400).send(e);
    }
})

app.post("/login",async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userEmail = await Register.findOne({email:email});

        const isMatch = await bcrypt.compare(password,userEmail.password);

        const token = await userEmail.generateAuthToken()

        if(isMatch){

            res.status(201).render("index");
        }
        else{
            res.send("invalid details..");
        }
    }
    catch(e){
        res.status(400).send("invalid login details..");
    }
})

app.listen(port,()=>{
    console.log(`server is listening on port: ${port}`);
})