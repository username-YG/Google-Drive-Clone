const { PermissionModel } = require('../database');

// adding a permission for a user on a certain file or directory
const addPermission = async (fileOrDirId, userID, role) => {
    const record = await PermissionModel.findOneAndUpdate(
        { fileOrDirId },
        { $set: { [`permissions.${userID}`]: role } },
        { upsert: true, new: true }
    );
    return { userID, role }
}

// retrieving permissions for a certain file or directory
const getPermissions = async (fileOrDirId) => {
    const record = await PermissionModel.findOne({ fileOrDirId });
    return record ? Object.fromEntries(record.permissions) : {};
}

// updating a permission for a user on a certain file or directory
const updatePermission = async (fileOrDirId, userID, role) => {
    await PermissionModel.findOneAndUpdate(
        { fileOrDirId },
        { $set: { [`permissions.${userID}`]: role } }
    );
}

// deleting a permission for a user on a certain file or directory
const deletePermission = async (fileOrDirId, userID) => {
    await PermissionModel.findOneAndUpdate(
        { fileOrDirId },
        { $unset: { [`permissions.${userID}`]: "" } }
    );
}

// deleting all the permissions of a certain file or directory
const deleteAllPermissions = async (fileOrDirId) => {
    await PermissionModel.deleteOne({ fileOrDirId });
}

module.exports = {
    addPermission,
    getPermissions,
    updatePermission,
    deletePermission,
    deleteAllPermissions
};