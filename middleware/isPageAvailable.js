const Confluence = require("confluence-api");
const { Client } = require("@notionhq/client");

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

const isPageAvailable =  { 
    isPageOnNotion: async(req,res,next) => {
    try{
        //console.log(req.body.notionPageId)
        const pageMetaData = await notion.pages.retrieve({page_id: req.body.notionPageId})
        req.title=pageMetaData.properties.title.title[0].plain_text;
        //console.log()
        if(pageMetaData.object == "page") next();
    }
    catch(err)
    {
        //err = JSON.parse(JSON.stringify(err.body)).message;
        let message="Some Internall Problem";
        if(err.body) message=JSON.parse(err.body).message
        //console.log(err.body)
        res.status(err.status || 500).render(
            'input',{
            title : "Input 📝",
            process : true,
            error : true,
            expression1 : "😡",
            status : err.status || 500,
            message :  message
        })
    }
    },

    isPageOnConf: async(req,res,next) =>{
        try{
           //console.log(req.title)
           confluence.getContentByPageTitle(req.body.confluenceWorkSpaceName, req.title, (err,data)=>{
           //console.log(data);
           
        if(data && data.results.length) {
            res.status(400).render("input",{
                title : "Input 📝",
                process : true,
                error : true,
                expression1 : "😡",
                status : 400,
                message : "The given page "+req.title+", Already available on Confluence"
            })
           }
        else if(err || data.results.length==0)
        {
         next();
        }
           })
        }
        catch(err)
        {
            res.status(500).render("input",{
                title : "Input 📝",
            process : true,
            error : true,
            expression1 : "😔",
            status : 500,
                err : err || "Some Internal Error Caused"
            })
        }
    }

}

module.exports = isPageAvailable