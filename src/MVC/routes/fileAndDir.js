const express = require('express')
const router = express.Router()
const controller = require('../controllers/fileAndDir')

router.route('/')
        .get(controller.getAllFilesAndDirs)
        .post(controller.createFileOrDir)

router.route('/:id')
        .get(controller.getFileOrDirById)
        .patch(controller.updateFileOrDir)
        .delete(controller.deleteFileOrDir)

router.route('/:id/permissions')
        .get(controller.getPermissions)
        .post(controller.setPermissions)

router.route('/:id/permissions/:pId')
        .patch(controller.updatePermission)
        .delete(controller.deletePermission)


module.exports = router