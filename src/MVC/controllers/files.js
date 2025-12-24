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
    if (!Files.getMetadata(req.params.id)) res.status(404).json({ error: 'Not found' });
    const file = Files.getFile(req.params.id);
    if (Files.err) return res.status(500).json({ error: '500 Internal server error' });
    res.json(file);
}

exports.updateFile = (req, res) => {

    // Ensure there are fields to update
    const { name, content, parentId } = req.body
    if (name === undefined && content === undefined && parentId === undefined) {
        return res.status(400).send("Bad Request");
    }

    // Ensure the file exists
    if (!Files.getMetadata(req.params.id)) return res.status(404).json({ error: 'Not found' });

    // Ensure the parent exists and is a folder
    if (parentId) {
        const parent = Files.getMetadata(parentId);
        if (!parent || !parent.isFolder) {
            return res.status(404).json({ error: 'Not found' });
        }
    }

    const updatedFile = Files.updateFile(req.params.id, name, content, parentId);
    if (Files.err) return res.status(500).json({ error: '500 Internal server error' });
    res.json(updatedFile);
}

exports.deleteFile = (req, res) => {
    if (!Files.getMetadata(req.params.id)) res.status(404).json({ error: 'Not found' });
    Files.deleteFile(req.params.id)
    if (Files.err) return res.status(500).json({ error: '500 Internal server error' });
    res.status(204).end()
}