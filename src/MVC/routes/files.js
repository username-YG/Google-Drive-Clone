const express = require('express')
const router = express.Router()
const controller = require('../controllers/files')
const permController = require('../controllers/permissions')
const tokenController = require('../controllers/tokens')

router.route('/')
        .get(tokenController.isLoggedIn, controller.getAllFiles)
        .post(tokenController.isLoggedIn, controller.createFile)

router.route('/:id')
        .get(tokenController.isLoggedIn, controller.getFile)
        .patch(tokenController.isLoggedIn, controller.updateFile)
        .delete(tokenController.isLoggedIn, controller.deleteFile)

router.route('/:id/permissions')
        .get(tokenController.isLoggedIn, permController.getPermissions)
        .post(tokenController.isLoggedIn, permController.createPermission)

router.route('/:id/permissions/:pId')
        .patch(tokenController.isLoggedIn, permController.updatePermission)
        .delete(tokenController.isLoggedIn, permController.deletePermission)

module.exports = router