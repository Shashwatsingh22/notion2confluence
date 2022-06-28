const express = require('express');
const router = express.Router();

//Importing MiddleWare
const checkPage = require('../middleware/isPageAvailable')

//Importing Controllers
const mainController = require('../controller/main');

router.get('/',mainController.homePage);

router.get('/input',mainController.input);

router.post('/startProcess',checkPage.isPageOnNotion,checkPage.isPageOnConf,mainController.sendPage2Confluence);

module.exports = router;