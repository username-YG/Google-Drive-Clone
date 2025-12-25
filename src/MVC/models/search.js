const FILES = require("./files")
const PERMS = require("./permissions")

exports.getFiles = async (query, usrId) => {
    // getting files or dirs which contian query in their contnet in the cpp "library"
    let msg = `search ${query}`
    const files = await FILES.sendToServer(msg)
    const fileArray = files.trim() ? files.trim().split(/\s+/) : [];
    const filteredFilesID = []

    // making sure the files or dirs contain the query in their content and not just in their ID
    for (const element of fileArray) {
        msg = `get ${element}`
        const content = await FILES.sendToServer(msg)

        if (content.includes(query)) {
            filteredFilesID.push(element)
        }
    }

    const filesIDs = FILES.getAllFiles()
    // getting files or dirs which contian query in their names in the web "library"
    for (const fileID of filesIDs) {
        const info = FILES.getMetadata(fileID)

        if (info.name.includes(query)) {
            filteredFilesID.push(info.name)
        }
    }

    // Remove duplicates
    const uniqueNames = [];
    for (const name of filteredFilesID) {
        if (!uniqueNames.includes(name)) {
            uniqueNames.push(name);
        }
    }

    // Remove no permission to read
    const permittedFiles = [];
    for (const fileId of filteredFilesID) {
        const perm = PERMS.getPermissions(fileId);
        if (perm && perm[usrId]) {
            const fileObj = await FILES.getFile(fileId);
            permittedFiles.push(fileObj);
        }
    }

    return permittedFiles
}