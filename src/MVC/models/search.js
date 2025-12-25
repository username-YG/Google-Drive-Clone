const FILES = require("./files")

exports.getFiles = async (query) => {
    // getting files or dirs which contian query in their contnet in the cpp "library"
    let msg = `search ${query}`
    const files = await FILES.sendToServer(msg)
    const fileArray = files.trim() ? files.trim().split(/\s+/) : [];
    const filteredFilesID = []
    const fileNames = []

    // making sure the files or dirs contain the query in their content and not just in their ID
    for (const element of fileArray) {
        msg = `get ${element}`
        const content = await sendToServer(msg)

        if (content.includes(query)) {
            filteredFilesID.push(element)
        }
    }

    // converting the ids into the display names
    for (const fileID of filteredFilesID) {
        const info = FILES.getMetadata(fileID)
        fileNames.push(info.name) 
    }

    const filesIDs = FILES.getAllFiles()
    // getting files or dirs which contian query in their names in the web "library"
    for (const fileID of filesIDs) {
        const info = FILES.getMetadata(fileID)

        if (info.name.includes(query)) {
            fileNames.push(info.name)
        }
    }
    return fileNames
}