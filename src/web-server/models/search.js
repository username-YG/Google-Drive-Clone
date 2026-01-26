const FILES = require("./files")
const PERMS = require("./permissions")
const { FileModel } = require('../database');

exports.getFiles = async (query, usrId) => {

    const filteredFilesID = new Set(); // Set so we don't duplicate

    // getting files or dirs which contian query in their contnet in the cpp "library"
    const res = await FILES.sendToServer(`search ${query}`);
    const serverFileIDs = res.trim() ? res.trim().split(/\s+/) : [];

    // making sure the files or dirs contain the query in their content and not just in their ID
    for (const fileId of serverFileIDs) {
        const content = await FILES.sendToServer(`get ${fileId}`);
        if (content.includes(query)) {
            filteredFilesID.add(fileId);
        }
    }

    // getting files or dirs which contian query in their names in the web "library"
    const nameMatches = await FileModel.find({
        name: { $regex: query, $options: 'i' }
    });

    for (const file of nameMatches) {
        filteredFilesID.add(file.id);
    }

    // Remove files with no permission to read
    const permittedFiles = [];
    for (const fileId of filteredFilesID) {
        const perm = await PERMS.getPermissions(fileId);
        if (perm && perm[usrId]) {
            const fileObj = await FILES.getFile(fileId);
            permittedFiles.push(fileObj);
        }
    }

    return permittedFiles;
}