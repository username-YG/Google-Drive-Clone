const express = require('express')
router = express.Router()
const controller = require('../controllers/tokens')

router.route('/')
        .post(controller.checkUserSignedIn)