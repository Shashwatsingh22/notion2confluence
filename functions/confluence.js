const Confluence = require("confluence-api");



const configConfluence = {
    username : process.env.CONFLUENCE_USERNAME,
    password : process.env.CONFLUENCE_TOKEN,
    baseUrl : process.env.CONFLUENCE_URL
}

const confluence = new Confluence(configConfluence);