const Files = require('../models/files')
const Perm = require('../models/permissions')

exports.createFile = async (req, res) => {
    try {

        // Return 400 when no body or header of userid is sent
        if (!req.body || !req.headers || !req.headers['x-user-id']) {
            return res.status(400).json({ error: "Bad Request" })
        }

        const { name, content, isFolder, parentId } = req.body;

        // Return 400 when a field is missing
        // Return 400 when the content field is missing for a file
        // Return 400 when the name is empty
        if ((name === undefined || isFolder === undefined || parentId === undefined)
            || (name === "" || name === null)
            ||  (isFolder === false && content === undefined)) {
            return res.status(400).json({ error: "Bad Request" })
        }

        // Return 404 is the parent doesn't exist or isn't a folder
        if (parentId) { // A null parent is root folder
            const parentMetadata = Files.getMetadata(parentId);
            if (!parentMetadata || !parentMetadata.isFolder) {
                return res.status(404).json({ error: 'Not found' });
            }
        }

        const newFile = await Files.createFile(name, content, isFolder, parentId);
        Perm.addPermission(newFile.id, req.headers['x-user-id'], "owner"); // Add owner permissions
        res.status(201).location(`/api/files/${newFile.id}`).end()

    } catch(err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getAllFiles = (req, res) => {
    try {

        // Return 400 when no header of userid is sent
        if (!req.headers || !req.headers['x-user-id']) {
            return res.status(400).json({ error: "Bad Request" })
        }
        res.json(Files.getAllFiles());

    } catch(err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getFile = async (req, res) => {

    try {

        // Return 400 when no header of userid is sent
        if (!req.headers || !req.headers['x-user-id']) {
            return res.status(400).json({ error: "Bad Request" })
        }

        // Return 404 if the file doesn't exist
        if (!Files.getMetadata(req.params.id)) {
            return res.status(404).json({ error: 'Not found' });
        }

        const file = await Files.getFile(req.params.id);
        res.json(file);

    } catch(err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.updateFile = async (req, res) => {

    try {
        // Return 400 when no body or header of userid is sent
        if (!req.body || !req.headers || !req.headers['x-user-id']) {
            return res.status(400).json({ error: "Bad Request" })
        }

        /*
        The fields that can be changed using patch are only:
        - name
        - parentId
        - content (if it is a file)
        */
        let { name, content, parentId } = req.body

        // Ensure the file exists
        const item = Files.getMetadata(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Not found' });
        }

        // The content fields is ignored for folders
        if (item.isFolder) content = undefined

        // Return 400 when all fields are missing
        // Return 400 when new name is empty
        if ((name === undefined && content === undefined && parentId === undefined)
            || (name === "" || name === null)) {
            return res.status(400).json({ error: "Bad Request" })
        }

        // Ensure the parent exists and is a folder
        if (parentId) {  // A null parent is root folder
            const parent = Files.getMetadata(parentId);
            if (!parent || !parent.isFolder) {
                return res.status(404).json({ error: 'Not found' });
            }
        }

        const updatedFile = await Files.updateFile(req.params.id, name, content, parentId);
        res.json(updatedFile);

    } catch(err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}

exports.deleteFile = async (req, res) => {

    try {
        
        // Return 400 when no header of userid is sent
        if (!req.headers || !req.headers['x-user-id']) {
            return res.status(400).json({ error: "Bad Request" })
        }

        // Return 404 if the file doesn't exist
        if (!Files.getMetadata(req.params.id)) {
            return res.status(404).json({ error: 'Not found' });
        }

        await Files.deleteFile(req.params.id);
        res.status(204).end()

    } catch(err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}