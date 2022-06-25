const express = require('express');
const router = express.Router();
const Confluence = require("confluence-api");

//Importing Functions
const { getNotionPage,createPage,getPageMetaData } = require('../functions/notion');


const configConfluence = {
    username : process.env.CONFLUENCE_USERNAME,
    password : process.env.CONFLUENCE_TOKEN,
    baseUrl : process.env.CONFLUENCE_URL
}

const confluence = new Confluence(configConfluence);


router.post('/notion/page',(req,res,next)=>{
    
    
    getNotionPage(req.body.notionPageId)
    .then(result=>{
        createPage(result.results).then(
            page=>{
                res.status(200).json({
                status: true,
                message : "Got the Data",
                data: page,
                notion : result
            })
    });

        
    }).catch(err=>{
        res.status(500).json({
            status: false,
            message : "Some Internall Error Caused1",
            err : err
        })
    })
})

router.post('/conf/page', (req,res,next)=>{
          
    confluence.postContent('PUTINGDATA','DevOps1',"Some Data",null,function(err,data){
       if(err)
       {
        res.status(500).json({
            status: false,
            message : "Some Internall Error Caused",
            err : err
        })
       }
       else
       {
            res.status(200).json({
                status: true,
                message : "Got the Data",
                data: data
            })
       }
})
    
});

module.exports = router;