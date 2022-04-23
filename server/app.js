const dotenv =require('dotenv')
const express = require('express');
const app = express();


dotenv.config({path:'./config.env'});
require('./db/conn');
app.use(express.json());
// const User = require('./model/userSchema')
// linked router file
app.use(require('./router/auth'));




/* app.get("/about", (req, res) => {
    res.send("hii from about page");
    console.log("hello about page");
  }); */
  
  
 /*  app.get("/signin", (req, res) => {
    res.send("hii from signin page");
  }); */

  /* app.get("/register", (req, res) => {
    res.send("hii from register page");
    }); */
const PORT = process.env.PORT

app.listen(PORT);