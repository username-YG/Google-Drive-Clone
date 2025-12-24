import net from "net";

const rootId = crypto.randomUUID();
const filesystem = [ { id: rootId, name: "/", isFolder: true, parentId: null, content: [] } ];

let sock = null;
const sendToServer = (msg) => {
    return new Promise((resolve, reject) => {

        // Send message to server
        const ip = process.argv[2];
        const port = +process.argv[3];
        sock = net.connect(port, ip, () => sock.write(`${msg.length} ${msg}`));

        // Get response from server
        let res = '', len = null;
        sock.on("data", chunk => {
            res += chunk;

            // Parsing length
            if (len === null && res.includes(" ")) [len, res] = [parseInt(res), res.slice(res.indexOf(" ") + 1)];

            // When finished reading all
            if (len !== null && len <= res.length) {
                sock.end();
                sock = null;
                res = res.slice(0, len);
                if (res.startsWith("500")) reject(new Error(res));
                // Remove the status msg and the last '\n'
                const index = res.indexOf("\n\n");
                res = (index === -1) ? "" : res.slice(index + 2).slice(0, -1);
                resolve(res);
            }
            
        });

        sock.on("error", reject);
    });
}

const getMetadata = (id) => filesystem.find(a => a.id === id);

async function createFile(name, content, isFolder, parentId) {

    // Generate a unique ID
    let id;
    while (getMetadata(id = crypto.randomUUID()));

    // Add new item to array
    if (parentId === null) parentId = rootId;
    const newItem = { id, name, isFolder, parentId, content: [] };
    filesystem.push(newItem);

    // Update parent folder
    getMetadata(parentId).content.push(id);
    
    // If it is a file, save the content on the server
    if (isFolder === false) await sendToServer(`POST ${id} ${content}`);
    return newItem;
}

function getAllFiles() {
    return getMetadata(rootId).content;
}

async function getFile(id) {
    // We use a copy so we don't store the content on the server
    const copy = JSON.parse(JSON.stringify(getMetadata(id)));
    if (copy.isFolder === false) copy.content = await sendToServer(`GET ${id}`);
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
    if (parentId === null) parentId = rootId;
    if (parentId) {
        const oldParent = getMetadata(item.parentId);
        oldParent.content.splice(oldParent.content.indexOf(id), 1);
        item.parentId = parentId;
    }

}

async function deleteFile(id) {
    
    // Remove item's metdata and content
    const item = getMetadata(id);
    filesystem.splice(filesystem.findIndex(a => a.id === id), 1);
    await sendToServer(`DELETE ${id}`);

    // Update parent
    if (item.parentId) {
        const parent = getMetadata(item.parentId);
        parent.content.splice(parent.content.indexOf(id), 1);
    }

    // Recursively delete subdir
    if (item.isFolder) {
        for (child in item.content) {
            await deleteFile(child);
        }
    }
}

process.on('SIGINT', () => {
    if (sock) sock.end();
    process.exit();
})

export {
    getMetadata,
    getAllFiles,
    getFile,
    createFile,
    updateFile,
    deleteFile
}