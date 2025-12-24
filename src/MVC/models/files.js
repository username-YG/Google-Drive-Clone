import net from "net";

const rootId = createRoot();
const filesystsem = [];

async function createRoot() {
    const id = crypto.randomUUID();
    const rootFolder = { id, name: "/", isFolder: true, parentId: null };
    filesystsem.push(rootFolder);
    await sendToServer(`POST ${id} []`);
    return id;
}

const getMetadata = (id) => filesystsem.find(a => a.id === id);

const sendToServer = (msg) => {
    return new Promise((resolve, reject) => {

        // Send message to server
        const sock = net.connect(1234, "localhost", () => s.write(`${msg.length} ${msg}`));

        // Get response from server
        let res = '', len = null;
        sock.on("data", chunk => {

            // Parsing length
            res += chunk;
            if (len === null && res.includes(" ")) [len, res] = [parseInt(res), res.slice(res.indexOf(" ") + 1)];

            // When finished reading all
            if (len && len <= res.length) {
                sock.end();
                res = res.slice(0, len);
                res.startsWith("500") ? reject(new Error(res)) : resolve(res);
            }
            
        });

        sock.on("error", reject);
    });
}

async function updateParent(itemId, parentId, add) {
    if (!parentId) return;
    const content = getFile(parentId).content;
    if (add) {
        content.push(itemId)
    } else {
        content.splice(parent.indexOf(itemId), 1);
    }
    await updateFile(parentId, {content});
}

async function createFile(name, content, isFolder, parentId) {
    
    // Generate a unique ID
    let id;
    while (getMetadata(id = crypto.randomUUID()));

    // Add new item to array and update parent
    const newItem = { id, name, isFolder, parentId };
    filesystsem.push(newItem);
    await updateParent(id, parentId, true);

    // Create the file on the server
    await sendToServer(`POST ${id} ${content}`);
    return newItem;
}

async function getFile(id) {

    // Get the content from the server
    const item = getMetadata(id);
    const content = await sendToServer(`GET ${id}`);
    if (item.isFolder) content = JSON.parse(content);

    // We use a copy because we don't want to save the content here
    const copy = JSON.parse(JSON.stringify(item));
    copy.content = content;
    return copy;

}

async function updateFile(id, name, content, parentId) {

    const item = getMetadata(id);

    // Update name is asked to
    if (name) {
        item.name = name;
    }

    // Update content if asked to
    // Attempting to change folder content is invalid and ignored
    if (content && !item.isFolder) {
        await sendToServer(`DELETE ${id}`);
        await sendToServer(`POST ${id} ${content}`);
    }

    // Update parent if asked to
    if (parentId) {
        const oldParentId = item.parent;
        item.parent = parentId;
        await updateParent(id, oldParentId, false);
    }

}

async function deleteFile(id) {
    filesystsem.splice(filesystsem.findIndex(a => a.id === id), 1);
    await sendToServer(`DELETE ${id}`);
}

export {
    rootId,
    createRoot,
    getMetadata,
    getFile,
    createFile,
    deleteFile
}