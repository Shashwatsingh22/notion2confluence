const express = require('express');
const router = express.Router();


//Importing Controllers
const mainController = require('../controller/main');

router.get('/',mainController.homePage);

router.get('/input',mainController.input);

router.post('/startProcess',mainController.sendPage2Confluence);

module.exports = router;