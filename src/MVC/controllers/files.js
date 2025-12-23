const Files = require('../models/files')

exports.createFile = (req, res) => {

    // Get fields
    const { name, content, isFolder, parentId } = req.body;
    if ([name, content, isFolder, parentId].includes(undefined)) {
        return res.status(400).send("Bad Request");
    }

    // Validate
    const parentMetadata = Files.getMetadata(parentId);
    if (!parentMetadata || !parentMetadata.isFolder) {
        return res.status(404).json({ error: 'Not found' });
    }

    const newFile = Files.createFile(name, content, isFolder, parentId);
    res.status(201).location(`/api/files/${newFile.id}`).end()
}

exports.getAllFiles = (req, res) => {
    return res.json(Files.getFile(Files.rootId));
}

exports.getFile = (req, res) => {
    if (!Files.getMetadata(req.params.id)) {
        res.status(404).json({ error: 'Not found' });
    }
    res.json(Files.getFile(req.params.id));
}

exports.updateFile = (req, res) => {

    // Other fields can't change and will be ignored
    const { name, content, parentId } = req.body

    if (name === undefined && content === undefined && parentId === undefined) {
        return res.status(400).send("Bad Request");
    }

    if (!Files.getMetadata(req.params.id)) {
        return res.status(404).json({ error: 'Not found' });
    }

    if (parentId !== undefined && !Files.getMetadata(parentId)) {
        return res.status(404).json({ error: 'Not found' });
    }

    const updatedFile = Files.updateFile(req.params.id, name, content, parentId);
    res.json(updatedFile);
}

exports.deleteFile = (req, res) => {
    if (!Files.getMetadata(req.params.id)) {
        res.status(404).json({ error: 'Not found' });
    }
    Files.deleteFile(req.params.id)
    res.status(204).end()
}

exports.getPermissions = (req, res) => {
}

exports.setPermissions = (req, res) => {
}

exports.updatePermission = (req, res) => {
}

exports.deletePermission = (req, res) => {
}