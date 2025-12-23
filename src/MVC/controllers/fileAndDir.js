const FileOrDir = require('../models/fileAndDir')

exports.createFileOrDir = (req, res) => {
    const item = FileOrDir.getFileOrDirById(parseInt(req.params.id));
    if (item === "404") {
        return res.status(404).json({ error: 'Not found' });
    }
    if (item === "500") {
        return res.status(500).json({ error: 'Not found' });
    }
    // return 
}

exports.getFileOrDirById = (req, res) => {
    const item = FileOrDir.getFileOrDirById(parseInt(req.params.id));
    if (!item) {
        return res.status(404).json({ error: 'Not found' });
    }
    res.json(item);
}

exports.updateFileOrDir = (req, res) => {
}

exports.deleteFileOrDir = (req, res) => {
}

exports.getPermissions = (req, res) => {
}

exports.setPermissions = (req, res) => {
}

exports.updatePermission = (req, res) => {
}

exports.deletePermission = (req, res) => {
}