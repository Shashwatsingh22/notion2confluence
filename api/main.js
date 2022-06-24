const express = require('express');
const router = express.Router();
//Importing Functions
const { getNotionPage,createPage } = require('../functions/notion');

router.post('/notion/page',(req,res,next)=>{
    getNotionPage(req.body.notionPageId)
    .then(result=>{
        createPage(result.results).then(
            res.status(200).json({
                status: true,
                message : "Got the Data",
                data: result
            })
        );

        
    }).catch(err=>{
        res.status(500).json({
            status: false,
            message : "Some Internall Error Caused1",
            err : err
        })
    })
})

router.post('/conf/page', (req,res,next)=>{
          
    confluence.getContentByPageTitle('PUTINGDATA','DevOps',function(err,data){
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