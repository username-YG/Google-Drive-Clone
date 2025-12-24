const express = require('express')
const router = express.Router()
const controller = require('../controllers/fileAndDir')
const permController = require('../controllers/permissions')

router.route('/')
        .get(controller.getAllFilesAndDirs)
        .post(controller.createFileOrDir)

router.route('/:id')
        .get(controller.getFileOrDirById)
        .patch(controller.updateFileOrDir)
        .delete(controller.deleteFileOrDir)

router.route('/:id/permissions')
        .get(permController.getPermissions)
        .post(permController.createPermission)

router.route('/:id/permissions/:pId')
        .patch(permController.updatePermission)
        .delete(permController.deletePermission)

module.exports = router