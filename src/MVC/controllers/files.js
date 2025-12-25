const Files = require('../models/files')
const Perms = require('../models/permissions')
const Users = require('../models/users')

exports.createFile = async (req, res) => {
    try {

        // Return 400 when no body or header of userid is sent
        if (!req.body || !req.headers || !req.headers['x-user-id']) {
            return res.status(400).json({ error: "Bad Request" })
        }
        const usrId = req.headers['x-user-id'];

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

        // Return 404 if the user doesn't exist
        if (!Users.findByID(usrId)) {
            return res.status(404).json({ error: 'Not found' });
        }

        // Return 403 if the user doesn't have permissions to write to the parent folder
        // Everyone is allowed to write to the root so we don't check that
        if (parentId) {
            const perm = Perms.getPermissions(parentId);
            if (!perm || !perm[usrId] || (perm[usrId] != "owner" && perm[usrId] != "writer")) {
                return res.status(403).json({ error: "Forbidden" })
            }
        }

        const newFile = await Files.createFile(name, content, isFolder, parentId);
        Perms.addPermission(newFile.id, usrId, "owner"); // Add owner permissions
        res.status(201).location(`/api/files/${newFile.id}`).end()

    } catch(err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getAllFiles = async (req, res) => {
    try {

        // Return 400 when no header of userid is sent
        if (!req.headers || !req.headers['x-user-id']) {
            return res.status(400).json({ error: "Bad Request" })
        }
        const usrId = req.headers['x-user-id'];

        // Return 404 if the user doesn't exist
        if (!Users.findByID(usrId)) {
            return res.status(404).json({ error: 'Not found' });
        }

        // Filter only items the user is allowed to read
        const permittedFiles = [];
        for (const fileId of Files.getAllFiles()) {
            const perm = Perms.getPermissions(fileId);
            if (perm && perm[usrId]) {
                const fileObj = await Files.getFile(fileId);
                permittedFiles.push(fileObj);
            }
        }
        res.json(permittedFiles);

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
        const usrId = req.headers['x-user-id'];

        // Return 404 if the file doesn't exist
        // Return 404 if the user doesn't exist
        if (!Files.getMetadata(req.params.id) || !Users.findByID(usrId)) {
            return res.status(404).json({ error: 'Not found' });
        }

        // Return 403 if the user doesn't have permissions to read the item
        const perm = Perms.getPermissions(req.params.id);
        if (!perm || !perm[usrId]) {
            return res.status(403).json({ error: "Forbidden" })
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
        const usrId = req.headers['x-user-id'];

        /*
        The fields that can be changed using patch are only:
        - name
        - parentId
        - content (if it is a file)
        */
        let { name, content, parentId } = req.body

        // Ensure the file and user exists
        const item = Files.getMetadata(req.params.id);
        if (!item || !Users.findByID(usrId)) {
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

        // Return 403 if the user doesn't have permissions to write to the file
        // Everyone is allowed to write to the root so we don't check that
        const perm = Perms.getPermissions(req.params.id);
        if (!perm || !perm[usrId] || (perm[usrId] != "owner" && perm[usrId] != "writer")) {
            return res.status(403).json({ error: "Forbidden" })
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
        const usrId = req.headers['x-user-id'];

        // Return 404 if the file doesn't exist
        // Return 404 if the user doesn't exist
        if (!Files.getMetadata(req.params.id) || !Users.findByID(usrId)) {
            return res.status(404).json({ error: 'Not found' });
        }

        // Return 403 if the user doesn't have owner permissions
        const perm = Perms.getPermissions(req.params.id);
        if (!perm || !perm[usrId] || perm[usrId] != "owner") {
            return res.status(403).json({ error: "Forbidden" })
        }

        await Files.deleteFile(req.params.id);
        res.status(204).end()

    } catch(err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}