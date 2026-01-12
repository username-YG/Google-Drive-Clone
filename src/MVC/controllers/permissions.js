const Permission = require('../models/permissions')
const User = require('../models/users');

// valid roles that can be assigned to users
const roles = ["owner", "writer", "commenter", "reader"]

// controller method to get permissions for a file or directory
exports.getPermissions = (req, res) => {
    try {
        const fileOrDirId = req.params.id;

        const requesterID = req.user.ID;
        
        const filePermissions = Permission.getPermissions(fileOrDirId)

        // checking if file or directory exists
        if (!filePermissions) {
            return res.status(404).json({ error: "Permission not Found" })
        }

        // Return 404 if the user doesn't exist
        if (!User.findByID(requesterID)) {
            return res.status(404).json({ error: 'Authentication user not found' });
        }

        // checking if the requester's role is at least a reader
        if (!filePermissions[requesterID]) {
            return res.status(403).json({ error: "Forbidden" })
        }

        // retrieving and returning permissions
        res.status(200).json(filePermissions)
    } catch(err) {
        return res.status(500).json({ error : "Internal Server Error" })
    }
}

// controller method to create a permission for a file or directory
exports.createPermission = (req, res) => {
    try {
        const fileOrDirId = req.params.id;

        // checking the header and body of the request exist
        if (!req.body) {
            return res.status(400).json({ error: "Missing body" })
        }

        const requesterID = req.user.ID;
        let { userID, username, role } = req.body

        // If the username field exists we use it instead of userID
        if (username) userID = User.findByUsername(username)?.ID;

        // checking validity of the arguments
        if (!requesterID || !userID || !role || !roles.includes(role)) {
            return res.status(400).json({ error: "Missing args" })
        }

        // Return 404 if one of the users doesn't exist
        if (!User.findByID(requesterID)) {
            return res.status(404).json({ error: 'Authentication user not found' });
        }
        if (!User.findByID(userID)) {
            return res.status(404).json({ error: 'User in body not found' });
        }

        const filePermissions = Permission.getPermissions(fileOrDirId)

        // checking if file or directory exists
        if (!filePermissions) {
            return res.status(404).json({ error: "Permission not found" })
        }

        // checking if the requester's role is owner
        if (filePermissions[requesterID] !== "owner") {
            return res.status(403).json({ error: "Forbidden" })
        }

        // checking if the permission already exists
        if (filePermissions[userID]) {
            return res.status(404).json({ error: "Permission already exists" })
        }

        // creating the permission for the user and returning the location header
        const permission = Permission.addPermission(fileOrDirId, userID, role)
        res.status(201).location(`/api/files/${fileOrDirId}/permissions/${permission.userID}`).end()
    } catch(err) {
        return res.status(500).json({ error : "Internal Server Error" })
    }
}

// controller method to update a permission for a file or directory
exports.updatePermission = (req, res) => {
    try {
        const fileOrDirId = req.params.id
        const permissionId = req.params.pId

        // checking the header and body of the request exist
        if (!req.body) {
            return res.status(400).json({ error: "Missing body" })
        }

        const requesterID = req.user.ID;
        const { role } = req.body

        // checking validity of the arguments
        if (!requesterID || !role || !roles.includes(role)) {
            return res.status(400).json({ error: "Missing args" })
        }

        // Return 404 if one of the users doesn't exist
        if (!User.findByID(requesterID)) {
            return res.status(404).json({ error: 'Authentication user not found' });
        }
        if (!User.findByID(permissionId)) {
            return res.status(404).json({ error: 'User in body not found' });
        }

        const filePermissions = Permission.getPermissions(fileOrDirId)

        // checking if file or directory exists and the permission exists
        if (!filePermissions || !filePermissions[permissionId]) {
            return res.status(404).json({ error: "Permission not found" })
        }

        // checking if the requester's role is owner
        if (filePermissions[requesterID] !== "owner") {
            return res.status(403).json({ error: "Forbidden" })
        }

        // updating the permission for the user and returning no content
        Permission.updatePermission(fileOrDirId, permissionId, role)
        res.status(204).send()
    } catch(err) {
        return res.status(500).json({ error : "Internal Server Error" })
    }
}

// controller method to delete a permission for a file or directory
exports.deletePermission = (req, res) => {
    try {
        const fileOrDirId = req.params.id
        const permissionId = req.params.pId

        const requesterID = req.user.ID;

        // Return 404 if one of the users doesn't exist
        if (!User.findByID(requesterID)) {
            return res.status(404).json({ error: 'Authentication user not found' });
        }
        if (!User.findByID(permissionId)) {
            return res.status(404).json({ error: 'User in body not found' });
        }

        const filePermissions = Permission.getPermissions(fileOrDirId)

        // checking if file or directory exists and the permission exists
        if (!filePermissions || !filePermissions[permissionId]) {
            return res.status(404).json({ error: "Permission not found" })
        }

        // only the owner and the user itself can delete the user's permissions
        if (requesterID != permissionId) {
            // checking if the requester's role is owner
            if (filePermissions[requesterID] !== "owner") {
                return res.status(403).json({ error: "Forbidden" })
            }
        }

        // deleting the permission for the user and returning no content
        Permission.deletePermission(fileOrDirId, permissionId)
        res.status(204).send()
    } catch(err) {
        return res.status(500).json({ error : "Internal Server Error" })
    }
}