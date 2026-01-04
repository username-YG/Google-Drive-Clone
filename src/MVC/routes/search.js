const express = require('express')
const router = express.Router()
const controller = require('../controllers/search')
const tokenController = require('../controllers/tokens')

router.route('/:query')
        .get(tokenController.isLoggedIn, controller.searchFilesAndDirs)

module.exports = router