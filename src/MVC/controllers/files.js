const Files = require('../models/files')
const Perms = require('../models/permissions')
const Users = require('../models/users')

function doesOwn(item, userId) {
    const permissions = Perms.getPermissions(item.id);
    return (permissions && permissions[userId] == "owner");
}

function isToday(timestamp) {
    if (!timestamp) return false;
    
    const date = new Date(timestamp);
    const today = new Date();

    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

function filterFiles(files, filterType, userId) {

    // Possible filters
    const Filters = {
        "OWNS": (item) => { return doesOwn(item, userId) },
        "SHARES": (item) => { return !doesOwn(item, userId) },
        "STARRED": (item) => { return (item.starred.includes(userId)) },
        "TRASHED": (item) => { return item.trashed },
        "NOT TRASHED": (item) => { return !(item.trashed) },
        "NOT FOLDER": (item) => { return !(item.isFolder) },
        "RECENT": (item) => { return isToday(item.timestamp); }
    }

    // Get the function to filter with
    const filterFunc = Filters[filterType];
    if (typeof filterFunc !== 'function') return files;

    // Return filtered items
    let filteredFiles = files.filter(filterFunc);
    return filteredFiles;
}

exports.createFile = async (req, res) => {
    try {

        // Return 400 when no body or header of userid is sent
        if (!req.body) {
            return res.status(400).json({ error: "Missing body" })
        }
        const usrId = req.user.ID
        const { name, content, isFolder, parentId } = req.body;

        // Return 400 when a field is missing
        // Return 400 when the content field is missing for a file
        // Return 400 when the name is empty
        if ((!name || isFolder === undefined || parentId === undefined)
            ||  (isFolder === false && content === undefined)) {
            return res.status(400).json({ error: "Missing args" })
        }

        // Return 404 is the parent doesn't exist or isn't a folder
        if (parentId) { // A null parent is root folder
            const parentMetadata = Files.getMetadata(parentId);
            if (!parentMetadata || !parentMetadata.isFolder) {
                return res.status(404).json({ error: 'Parent not found' });
            }
        }

        // Return 404 if the user doesn't exist
        if (!Users.findByID(usrId)) {
            return res.status(404).json({ error: 'Authentication user not found' });
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
        const usrId = req.user.ID;
        const withContent = req.headers["withcontent"] !== "false";

        // Return 404 if the user doesn't exist
        if (!Users.findByID(usrId)) {
            return res.status(404).json({ error: 'Authentication user not found' });
        }

        // This special filter allows us to fetch items from all levels and not just root
        let allFiles = Files.getAllFiles();
        if (req.headers && req.headers.filter && req.headers.filter.includes("ALL LEVELS")) {
            allFiles = Files.getAllIDs();
        }

        // Filter only items the user is allowed to read
        const permittedFiles = [];
        for (const fileId of allFiles) {
            const perm = Perms.getPermissions(fileId);
            if (perm && perm[usrId]) {
                const fileObj = await Files.getFile(fileId, withContent);
                permittedFiles.push(fileObj);
            }
        }

        // If a filter has been specified in request, apply it
        let filteredFiles = permittedFiles;
        if (req.headers && req.headers.filter) {
            const filters = req.headers.filter.split(',');
            for (const filterType of filters) {
                filteredFiles = filterFiles(filteredFiles, filterType, usrId);
            }
        }

        res.json(filteredFiles);

    } catch(err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getFile = async (req, res) => {
    try {
        const usrId = req.user.ID;

        // Return 404 if the file doesn't exist
        if (!Files.getMetadata(req.params.id)) {
            return res.status(404).json({ error: 'File not found' });
        }
        // Return 404 if the user doesn't exist
        if (!Users.findByID(usrId)) {
            return res.status(404).json({ error: 'Authentication user not found' });
        }

        // Return 403 if the user doesn't have permissions to read the item
        const perm = Perms.getPermissions(req.params.id);
        if (!perm || !perm[usrId]) {
            return res.status(403).json({ error: "Forbidden" })
        }

        const withContent = req.headers["withcontent"] !== "false";
        let file = await Files.getFile(req.params.id, withContent);
        
        // If a filter has been specified for folder content, apply it
        if (file.isFolder && req.headers && req.headers.filter) {

            // Replace id's with actual files
            let filteredContent = await Promise.all(file.content.map(async (item) => { return await Files.getFile(item); }));

            // Filter
            const filters = req.headers.filter.split(',');
            for (const filterType of filters) {
                filteredContent = filterFiles(filteredContent, filterType, usrId);
            }

            // Replace actual file with id
            file.content = filteredContent.map(item => item.id);
        }

        res.json(file);

    } catch(err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.updateFile = async (req, res) => {
    try {
        const usrId = req.user.ID;

        /*
        The fields that can be changed using patch are only:
        - name
        - parentId
        - content (if it is a file)
        - trashed (is the file in trash)
        - starred (is starred for this user)
        - timestamp
        */
        let { name, content, parentId, starred, trashed, timestamp } = req.body

        // Ensure the file and user exists
        const item = Files.getMetadata(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'File not found' });
        }
        if (!Users.findByID(usrId)) {
            return res.status(404).json({ error: 'Authentication user not found' });
        }

        // The content fields is ignored for folders
        if (item.isFolder) content = undefined

        // Return 400 when all fields are missing
        // Return 400 when new name is empty
        if (!name
            && content === undefined
            && parentId === undefined
            && starred == undefined
            && trashed == undefined
            && timestamp == undefined) {
            return res.status(400).json({ error: "Missing args" })
        }

        // Ensure the parent exists and is a folder
        if (parentId) {  // A null parent is root folder
            const parent = Files.getMetadata(parentId);
            if (!parent || !parent.isFolder) {
                return res.status(404).json({ error: 'Parent not found' });
            }
            if (parentId === req.params.id) {
                return res.status(400).json({ error: "Can't move folder into itself" })
            }
        }

        // Return 403 if the user doesn't have permissions to read the file
        const perm = Perms.getPermissions(req.params.id);
        if (!perm || !perm[usrId]) {
            return res.status(403).json({ error: "Forbidden" })
        }

        // Return 403 if the user doesn't have owner permissions
        if (trashed !== undefined) {
            if (perm[usrId] != "owner") {
                return res.status(403).json({ error: "Forbidden" })
            }
        }

        // Return 403 if the user doesn't have permissions to write to the file
        // Everyone is allowed to write to the root so we don't check that
        if (name || content !== undefined || parentId !== undefined) {
            if (perm[usrId] != "owner" && perm[usrId] != "writer") {
                return res.status(403).json({ error: "Forbidden" })
            }
        }

        // Return 403 if the user doesn't have permissions to write to the folder
        // Everyone is allowed to write to the root so we don't check that
        if (parentId) {
            const parentPerm = Perms.getPermissions(parentId);
            if (!parentPerm || !parentPerm[usrId] || (parentPerm[usrId] != "owner" && parentPerm[usrId] != "writer")) {
                return res.status(403).json({ error: "Forbidden" })
            }
        }

        const updatedFile = await Files.updateFile(req.params.id,name, content, parentId, 
                                                    usrId, trashed, starred, timestamp);
        res.status(204).end()

    } catch(err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}

exports.deleteFile = async (req, res) => {
    try {
        const usrId = req.user.ID;

        // Return 404 if the user doesn't exist
        if (!Users.findByID(usrId)) {
            return res.status(404).json({ error: 'Authentication user not found' });
        }
        // Return 404 if the file doesn't exist
        if (!Files.getMetadata(req.params.id)) {
            return res.status(404).json({ error: 'File not found' });
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