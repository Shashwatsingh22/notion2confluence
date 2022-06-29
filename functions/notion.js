const { Client } = require("@notionhq/client");

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

exports.createPage = async(data) =>{

    let page="";
    let sizeOfContent=data.length;
    for(let count=0;count<data.length;count++)
    {
        const type = data[count].type;
        console.log(type);
        //console.log(" => ",page);
        switch (type) {
            case "paragraph":
                if(data[count].paragraph.rich_text.length)
                {
                page+="<p>"
                page+=decorateData(data[count].paragraph.rich_text[0]);
                page+="</p>"
                }
                else
                {
                    page+="<br/>"
                }
                break;

            case "heading_3":
                if(data[count].heading_3.rich_text.length)
                {
                page+="<h3>"
                page+=decorateData(data[count].heading_3.rich_text[0]);
                page+="</h3>"
                }
                else
                {
                    page+="<br/>"
                }
                break;
            
            case "heading_2":
                if(data[count].heading_2.rich_text.length)
                {
                page+="<h2>"
                page+=decorateData(data[count].heading_2.rich_text[0]);
                page+="</h2>"
                }
                else
                {
                    page+="<br/>"
                }
                break;  
            
            case "heading_1":
                if(data[count].heading_1.rich_text.length)
                {
                page+="<h1>"
                page+=decorateData(data[count].heading_1.rich_text[0]);
                page+="</h1>"
                }
                else
                {
                    page+="<br/>"
                }
                break;
            
            case "bulleted_list_item":
                if(!data[count-1] || data[count-1].type!="bulleted_list_item") page+="\n<ul>";

                if(data[count].bulleted_list_item.rich_text.length)
                {
                page+="<li>"
                page+=decorateData(data[count].bulleted_list_item.rich_text[0]);
                page+="</li>"
                }
                else
                {
                    page+="<br/>"
                }
                console.log(!data[count+1] || data[count+1].type!="bulleted_list_item");
                if(!data[count+1] || data[count+1].type!="bulleted_list_item")
                { 
                    page+="</ul>\n"; 
                    
                }
                break;
            
            case "table":
                //Here First we need to get the complete detail of table by blockId becoz its not giving complete info by normal call
                const has_column_header= data[count].table.has_column_header;
                const has_row_header= data[count].table.has_row_header;
                console.log(has_row_header);
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
                        //If An Extra Field without any data
                        if(!result[count].table_row.cells[itr].length) continue;

                        //Taking Care Of Headers
                         if(count==0 && has_row_header)
                        {
                        page+="<th>"
                        page+=decorateData(result[count].table_row.cells[itr][0]);
                        page+="</th>"
                        }
                        else if(itr==0 && has_column_header)
                        {
                            page+="<th>"
                            page+=decorateData(result[count].table_row.cells[itr][0]);
                            page+="</th>"         
                        }
                        else
                        {
                        page+="<td>"
                        page+=decorateData(result[count].table_row.cells[itr][0]);
                        page+="</td>"
                        }
                    }
                    page+="</tr>";
                }
                     
                   //}
                   page+="</table>";
                   //console.log("table ==>\n",page)
                }
                catch(err)
                {
                    return err;
                }
                
                break;

            default:
                break;
        }
    }
    
    return page;
}