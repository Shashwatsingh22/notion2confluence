const Confluence = require("confluence-api");
const { Client } = require("@notionhq/client");

//Importing Functions
const { createPage } = require('../functions/notion');

const configConfluence = {
    username : process.env.CONFLUENCE_USERNAME,
    password : process.env.CONFLUENCE_TOKEN,
    baseUrl : process.env.CONFLUENCE_URL
}

//Importing Notion
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  })

const confluence = new Confluence(configConfluence);

exports.homePage = (req,res,next) => {
    res.status(200).render(
        'home',
        {
            title : "Home 🏡"
        })
}

exports.input = (req,res,next) => {
    res.status(200).render(
        'input',
        {
            title : "Input 📝",
            process : false,
            error :  false
        }
    )
}

exports.sendPage2Confluence = async(req,res,next) => {
    try{
        const {notionPageId , confluenceWorkSpaceName} = req.body;

        console.log("Trying to Finding The Page MetaData . . . . . .")
        const pageMetaData = await notion.pages.retrieve({page_id: notionPageId});
        const title = pageMetaData.properties.title.title[0].plain_text;
        console.log("Got the Page MetaData");
        
        //--------Now we need the Page Blocks to create the Page ----
        console.log("Requesting for Page Blocks . . . ");
        const pageBlocks = await notion.blocks.children.list({block_id : notionPageId});
        
        //Lets Create the Page
        console.log("Recreating Page . . . . ")
        const page = await createPage(pageBlocks.results);
        //console.log(page);

        //Transfering Data to Confluence
        console.log("Started Sending Data to Confluence .. ..")
       confluence.postContent(confluenceWorkSpaceName,title,page,null,function(err,data)
        {
           console.log(data.status)
           if(data.status!=400)
           {
            console.log("here")
            res.status(200).render(
                'input',{
                    title : "Input 📝",
                process : true,
                error : false,
                status: 200,
                message : "Finally We Are able to Transfer the Page from Notion to Confluence!",
                //data: page,
                title : title,
                workspaceName : confluenceWorkSpaceName
            })
           }
           else if(data.status==400)
            {
                res.status(400).render('input',{
                    title : "Input 📝",
                    process : true,
                    error : true,
                    status: 400,
                    message : "A page with this title already exists: A page already exists with the title "+title+" in the space with key "+confluenceWorkSpaceName
                })
            } 
           else
           {

            res.status(404).render('input',{
                title : "Input 📝",
                process : true,
                error : true,
                status: 404,
                message : err
            })}
    })          
    }
    catch(err)
    {
        err=JSON.parse(JSON.stringify(err));
        
        if(err.status==404)
        {
            res.status(404).render('input',{
                title : "Input 📝",
                process :  true,
                error : true,
                status : 404,
                message : "Could not find page with ID: "+notionPageId+".Make sure the relevant pages and databases are shared with your integration"
            });
        }
        else
        {
        res.status(500).render('input',{
            title : "Input 📝",            
            process : true,
                        error : true,
                        status: 500,
                        message : "Some Internall Error Caused",
                    })
                }
    }
}