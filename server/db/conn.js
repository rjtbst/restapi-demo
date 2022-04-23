const mongoose= require('mongoose');

const DB = process.env.DATABASE;

mongoose.connect(DB).then(()=>{
    console.log('connection successfull')
    console.log('server is running on 5000')
}).catch((err)=> console.log('no connection'))