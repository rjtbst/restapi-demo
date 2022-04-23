const bcrypt = require("bcryptjs/dist/bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("../db/conn");
const authenticate = require("../middleware/authenticate");
const User = require("../model/userSchema");
const cookieParser = require("cookie-parser")

router.use(cookieParser());

router.get("/", (req, res) => {
  res.send("hello from home page from router");
});

//using pormises
/* router.post("/register", (req, res) => {
  const { name, email, phone, work, password, confirmPassword } = req.body;
  if (!name || !email || !phone || !work || !password || !confirmPassword) {
    return res.status(422).json({ error: "fill all the details" });
  }
  User.findOne({ email: email }).then((userExist) => {
    if (userExist) {
      return res.status(422).json({ error: "email already exist" });
    }

    const user = new User({ name, email, phone, work, password, confirmPassword });

    user
      .save()
      .then(() => {
        res.status(201).json({ message: "user registered successfully" });
      })
      .catch(() => {
        res.status(500).json({ errror: "registration failed" });
      });
  }).catch(err=>{console.log(err)})
});
 */

//using async await
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, confirmPassword, address } = req.body;
  if (!name || !email || !phone || !work || !password || !confirmPassword || !address) {
    return res.status(422).json({ error: "fill all the details" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "email already exist" });
    } else if (password != confirmPassword) {
      return res
        .status(422)
        .json({ error: "password ,confirm password are not same" });
    }

    const user = new User({ name, email, phone, work, password, confirmPassword, address });
    // password hashing before saving data

    await user.save();
    res.status(201).json({ message: "user registered successfully" });
  } catch (err) {
    console.log(err);
  }
});

//login route
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "fill data" });
    }

    const userLogin = await User.findOne({ email: email });

    // data show console.log(userLogin)
    if (userLogin) {
      const passmatch = await bcrypt.compare(password, userLogin.password);
      // generating jwt token
      const token = await userLogin.generateAuthToken();
      console.log(token);
      //storing token 
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now()+25892000000),
        hhtpOnly: true
      });

      if (!passmatch) {
        res.status(400).json({ error: "invalid password" });
      } else {
        res.json({ message: "user logged in successfully" });
      }
    } else {
      res.status(400).json({ error: "invalid email" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/about", authenticate, (req, res) => {
  res.send(req.rootUser);
});

//get userData for contact and home page
router.get("/getData",authenticate,(req,res)=>{
  res.send(req.rootUser);
});

//contactus page
router.post("/contact",authenticate, async(req, res) => {
try{
  const {name, email, phone, message}  = req.body;
   if(!name || !email || !phone || !message){
    res.status(400).json({ error: "contact form has a missing data field" });
    console.log("contact form has a missing data field");
   }
   const userExist =  await User.findOne({_id: req.userID})
   if(userExist){
     await userExist.addMessage(name,email, phone , message);
    await userExist.save();
    res.status(201).json({message: "user contact successfully"})
   }
   
}catch(error){
console.log(error)
}  

});


//logout
/* router.get('/logout', authenticate,(req,res)=>{
  res.send(req.rootUser)
  res.clearCookie('jwtoken',{path:'/'});
}) */

router.get('/logout', (req, res) => {
  res.clearCookie('jwtoken');
  return res.status(200).redirect('/login');
});

module.exports = router;
