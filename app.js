require('dotenv').config({path : './.env'})

const express = require('express')
const app = express()

//For Parssing the body
const bodyParser =require('body-parser');

//for log management we need this lib
const morgan=require('morgan');
const port = process.env.PORT || 4000;

//Controller+Route
const main = require('./api/main')

//Log Type
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

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

app.get('/',(req,res,next)=>{
    res.status(200).json({
        message : "Server Started Working!"
    })});

app.use('/send',main);    

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