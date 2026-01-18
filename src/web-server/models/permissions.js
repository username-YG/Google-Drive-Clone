// In-memory storage for permissions
const permissions = {}

// adding a permission for a user on a certain file or directory
const addPermission = (fileOrDirId, userID, role) => {
    if (!permissions[fileOrDirId]) {
        permissions[fileOrDirId] = {}
    }

    permissions[fileOrDirId][userID] = role
    return { userID, role }
}

// retrieving permissions for a certain file or directory
const getPermissions = (fileOrDirId) => {
    return permissions[fileOrDirId];
}

// updating a permission for a user on a certain file or directory
const updatePermission = (fileOrDirId, userID, role) => {
    permissions[fileOrDirId][userID] = role
}

// deleting a permission for a user on a certain file or directory
const deletePermission = (fileOrDirId, userID) => {
    delete permissions[fileOrDirId][userID]
}

// deleting all the permissions of a certain file or directory
const deleteAllPermissions = (fileOrDirId) => {
    delete permissions[fileOrDirId]
}

module.exports = { 
    addPermission, 
    getPermissions, 
    updatePermission,
    deletePermission,
    deleteAllPermissions
};