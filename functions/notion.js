const { Client } = require("@notionhq/client")

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  })

const decorateData = (aboutDataPresentation)=>{
    let page="";
    if(aboutDataPresentation.annotations.bold)
    {
        page+="<b>"
    }
    if(aboutDataPresentation.annotations.italic)
    {
        page+="<i>"
    }

    page+=aboutDataPresentation.plain_text;

    if(aboutDataPresentation.annotations.italic)
    {
        page+="</i>"
    }
    if(aboutDataPresentation.annotations.bold)
    {
        page+="</b>"
    }
    return page;            
}  

exports.getNotionPage = async(page_id)=>{
    const response = await notion.blocks.children.list({ block_id: page_id});
    return response;
}  
  

exports.createPage = async(data) =>{

    let page="";
    for(let count=0;count<data.length;count++)
    {
        const type = data[count].type;
        let text;

        switch (type) {
            case "paragraph":
                page+="<p>"
                page+=decorateData(data[count].paragraph.rich_text[0]);
                page+="</p>"
                break;

            case "heading_3":
                page+="<h3>"
                page+=decorateData(data[count].heading_3.rich_text[0]);
                page+="</h3>"
                break;
            
            case "heading_2":
                page+="<h2>"
                page+=decorateData(data[count].heading_2.rich_text[0]);
                page+="</h2>"
                break;  
            
            case "heading_1":
                page+="<h1>"
                page+=decorateData(data[count].heading_1.rich_text[0]);
                page+="</h1>"
                break;
            
            case "bulleted_list_item":
                if(data[count-1].type!="bulleted_list_item") page+="\n<ul>";

                page+="<li>"
                page+=decorateData(data[count].bulleted_list_item.rich_text[0]);
                page+="</li>"

                if(data[count+1].type!="bulleted_list_item") page+="</ul>\n";
                break;
            
            case "table":
                //Here First we need to get the complete detail of table by blockId becoz its not giving complete info by normal call
                try
                {
                   let tableData = await notion.blocks.children.list({ block_id: data[count].id});
                   let result = tableData.results;
                   page+="<table>";
                   for(let count=0;count<result.length;count++)
                   {
                    page+="<tr>";
                     //Rows
                     for(let itr=0;itr<result[count].table_row.cells.length;itr++)
                     {
                        //page+="<td>"+result[count].table_row.cells[itr][0].plain_text+"</td>";
                        
                        page+="<td>"
                        page+=decorateData(result[count].table_row.cells[itr][0]);
                        page+="</td>"
                     
                    }
                     page+="</tr>";
                   }
                   page+="</table>";
                }
                catch(err)
                {
                    console.log(err)
                }
                
                break;

            default:
                break;
        }
    }
    console.log(page);
}