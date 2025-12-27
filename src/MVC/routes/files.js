const express = require('express')
const router = express.Router()
const controller = require('../controllers/files')
const permController = require('../controllers/permissions')

router.route('/')
        .get(controller.getAllFiles)
        .post(controller.createFile)

router.route('/:id')
        .get(controller.getFile)
        .patch(controller.updateFile)
        .delete(controller.deleteFile)

router.route('/:id/permissions')
        .get(permController.getPermissions)
        .post(permController.createPermission)

router.route('/:id/permissions/:pId')
        .patch(permController.updatePermission)
        .delete(permController.deletePermission)

module.exports = router