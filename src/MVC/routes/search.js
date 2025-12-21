const express = require('express')
const router = express.Router()
const controller = require('../controllers/articles')

router.route('/:query')
        .get(controller.searchFilesAndDirs)

module.exports = router