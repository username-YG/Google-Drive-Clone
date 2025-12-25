const Permission = require('../models/permissions')
const User = require('../models/users');

// valid roles that can be assigned to users
const roles = ["owner", "writer", "commenter", "reader"]

// controller method to get permissions for a file or directory
exports.getPermissions = (req, res) => {
    try {
        const fileOrDirId = req.params.id

        // checking validity of the arguments
        if (!req.headers || !req.headers['x-user-id']) {
            return res.status(400).json({ error: "Bad Request" })
        }

        const requesterID = req.headers['x-user-id']
        
        const filePermissions = Permission.getPermissions(fileOrDirId)

        // checking if file or directory exists
        if (!filePermissions) {
            return res.status(404).json({ error: "Not Found" })
        }

        // Return 404 if the user doesn't exist
        if (!User.findByID(requesterID)) {
            return res.status(404).json({ error: 'Not found' });
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
        const fileOrDirId = req.params.id

        // checking the header and body of the request exist
        if (!req.headers || !req.body) {
            return res.status(400).json({ error: "Bad Request" })
        }

        const requesterID = req.headers['x-user-id']
        const { userID, role } = req.body

        // checking validity of the arguments
        if (!requesterID || !userID || !role || !roles.includes(role)) {
            return res.status(400).json({ error: "Bad Request" })
        }

        // Return 404 if one of the users doesn't exist
        if (!User.findByID(requesterID) || !User.findByID(userID)) {
            return res.status(404).json({ error: 'Not found' });
        }

        const filePermissions = Permission.getPermissions(fileOrDirId)

        // checking if file or directory exists
        if (!filePermissions) {
            return res.status(404).json({ error: "Not Found" })
        }

        // checking if the requester's role is owner
        if (filePermissions[requesterID] !== "owner") {
            return res.status(403).json({ error: "Forbidden" })
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
        if (!req.headers || !req.body) {
            return res.status(400).json({ error: "Bad Request" })
        }

        const requesterID = req.headers['x-user-id']
        const { role } = req.body

        // checking validity of the arguments
        if (!requesterID || !role || !roles.includes(role)) {
            return res.status(400).json({ error: "Bad Request" })
        }

        // Return 404 if one of the users doesn't exist
        if (!User.findByID(requesterID) || !User.findByID(permissionId)) {
            return res.status(404).json({ error: 'Not found' });
        }

        const filePermissions = Permission.getPermissions(fileOrDirId)

        // checking if file or directory exists and the permission exists
        if (!filePermissions || !filePermissions[permissionId]) {
            return res.status(404).json({ error: "Not Found" })
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

        // checking validity of the arguments
        if (!req.headers || !req.headers['x-user-id']) {
            return res.status(400).json({ error: "Bad Request" })
        }

        const requesterID = req.headers['x-user-id']

        // Return 404 if one of the users doesn't exist
        if (!User.findByID(requesterID) || !User.findByID(permissionId)) {
            return res.status(404).json({ error: 'Not found' });
        }

        const filePermissions = Permission.getPermissions(fileOrDirId)

        // checking if file or directory exists and the permission exists
        if (!filePermissions || !filePermissions[permissionId]) {
            return res.status(404).json({ error: "Not Found" })
        }

        // checking if the requester's role is owner
        if (filePermissions[requesterID] !== "owner") {
            return res.status(403).json({ error: "Forbidden" })
        }

        // deleting the permission for the user and returning no content
        Permission.deletePermission(fileOrDirId, permissionId)
        res.status(204).send()
    } catch(err) {
        return res.status(500).json({ error : "Internal Server Error" })
    }
}