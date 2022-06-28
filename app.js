require('dotenv').config({path : './.env'})

const express = require('express')
const app = express()
const path = require('path')

//For Parssing the body
const bodyParser = require('body-parser');

//View Engine
app.set('view engine','ejs');
app.set('views','views')

//for log management we need this lib
const morgan=require('morgan');
const port = process.env.PORT || 4000;

//Routes
const main = require('./routes/main')

//Log Type
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')))
//Resolving Cors Error 
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
   res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
})


app.use('/',main);    

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

//module.exports = app;
app.listen(port,()=>{
    console.log("Server Started 👂 At "+port);
})   