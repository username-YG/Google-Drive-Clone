import net from "net";

const rootId = createRoot();
const filesystsem = [];

// Create rood directory
const createRoot = () => {
    const id = crypto.randomUUID();
    const rootFolder = { id, name: "/", isFolder: true, parentId: null };
    filesystsem.push(rootFolder);
    sendToServer(`POST ${id} []`);
    return id;
}

// Return item metadata
const getMetadata = (id) => filesystsem.find(a => a.id === id);

// Send message to server and return response
const sendToServer = (msg) => {

    // Send message to server
    const sock = net.connect(1234, "localhost", () => s.write(`${msg.length} ${msg}`));

    // Get response from server
    let res = '', len = null;
    sock.on("data", chunk => {
        res += chunk;
        // The first word is the length
        if (!len && res.includes(" ")) {
            len = parseInt(res.slice(0, res.indexOf(" ")));
            res = res.slice(res.indexOf(" ") + 1);
        }
        // The rest is the msg
        if (len && len <= res.length) sock.end();
    });

    if (res === "500 Internal Server Error\n") throw res;
    return res;
}

// Update file's content
const updateParent = (itemId, parentId, add) => {
    const content = getFile(parentId).content;
    if (add) {
        content.push(itemId)
    } else {
        content.splice(parent.indexOf(itemId), 1);
    }
    updateFile(parentId, {content});
}

const createFile = (name, content, isFolder, parentId) => {
    
    // Generate a unique ID
    let id;
    while (getMetadata(id = crypto.randomUUID()));

    // Add new item to array and update parent
    const newItem = { id, name, isFolder, parentId };
    filesystsem.push(newItem);
    updateParent(id, parentId, true);

    // Create the file on the server
    sendToServer(`POST ${id} ${content}`);
    return newItem;
}

const getFile = (id) => {

    // Get the content from the server
    const item = getMetadata(id);
    const content = sendToServer(`GET ${id}`);
    if (item.isFolder) content = JSON.parse(str);

    // We use a copy because we don't want to save the content here
    const copy = JSON.parse(JSON.stringify(item));
    copy.content = content;
    return copy;

}

const updateFile = (id, name, content, parentId) => {

    const item = getMetadata(id);
    
    if (name) {
        item.name = name;
    }

    // Attempting to change folder content is invalid and ignored
    if (content && !item.isFolder) {
        sendToServer(`DELETE ${id}`);
        sendToServer(`POST ${id} ${content}`);
    }

    if (parentId) {
        /// we need to update  hereparent
    }

}

const deleteFile = (id) => {
    filesystsem.splice(filesystsem.indexOf(id), 1);
    return sendToServer(`DELETE ${id}`);
}

module.exports = {
    rootId,
    createRoot,
    getMetadata,
    getFile,
    createFile,
    deleteFile
}