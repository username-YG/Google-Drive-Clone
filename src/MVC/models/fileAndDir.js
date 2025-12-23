import net from "net";

const filesystsem = [];

const getMetadata = (id) => filesystsem.find(a => a.id === id);

const readResponse = (socket) => {

    let response = "";
    let len = null;

    socket.on("data", chunk => {

        // Append new chunk
        response += chunk.toString();

        // If haven't read msg length yet
        if (len === null) {

            // If found first space, update len and response
            const spacePos = response.indexOf(" ");
            if (spacePos !== -1) {
                len = parseInt(res.slice(0, spacePos));
                response = response.slice(spacePos + 1);
            }

        }

        // Stop when read the whole message
        if (len !== null && response.length >= len) socket.end();

    });

    return response;
}

const sendToServer = (message) => {
    // Send message to server
    const socket = net.createConnection({ host: "localhost", port: 1234 }, () => {////////////////////// fix host and port
        message = `${message.length} ${message}`;
        socket.write(message);
    });
    return readResponse(socket);
}

const updateParent = (itemID, parentID) => {

    // Get the parent and make sure it is an existing folder
    const parent = getFileOrDirById(parentID);
    if (!parent || parent.isFile) return undefined;
    if (!getMetadata(itemID)) return undefined;

    // Ensure the item exists and edit the parent
    parent.content.push(itemID);
    updateFileOrDir(parentID, {content: content});

}

const createFileOrDir = (name, content, isFile, parent) => {
    
    if (!parent) parent = '\\' /////////////////// default
    if (!getMetadata(parent)) return undefined;

    // Generate a unique ID
    let id;
    do {
        id = crypto.randomUUID();
    } while (getMetadata(id));

    // Add new item to array and update parent
    const newItem = { id, name, isFile, parent };
    filesystsem.push(newItem);
    updateParent(id, parent);
    return newItem;

}

const getFileOrDirById = (id) => {

    // Get the item if it exists
    const item = getMetadata(id);
    if (!item) return undefined;

    // Get the content from the server
    const content = sendToServer(`GET ${id}`);
    if (!item.isFile) content = JSON.parse(str);

    // We use a copy because we don't want to save the content here
    const copy = JSON.parse(JSON.stringify(item));
    copy.content = content;
    return copy;
}

const updateFileOrDir = (id, ) => {

    // Get the item if it exists
    const item = getMetadata(id);
    if (!item) return undefined;

    // update
    // delete
    // post

}

const deleteFileOrDir = (id) => {
    if (!getMetadata(id)) return undefined;
    return sendToServer(`DELETE ${id}`);
}

module.exports = {
    createFileOrDir,
    getArticleById
}