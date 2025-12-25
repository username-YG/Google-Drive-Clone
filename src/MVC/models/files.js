import net from "net";
import { getPermissions, deleteAllPermissions } from './permissions.js'

const rootId = crypto.randomUUID();
const filesystem = [ { id: rootId, name: "/", isFolder: true, parentId: null, content: [], permissions: {} } ];

const sendToServer = (msg) => {
    return new Promise((resolve, reject) => {

        // Send message to server
        const ip = process.argv[2];
        const port = +process.argv[3];
        const sock = net.connect(port, ip, () => sock.write(`${Buffer.byteLength(msg)} ${msg}`));
        sock.setTimeout(2000); // 2 sec before we give up

        // Get response from server
        let res = Buffer.alloc(0), len = null; // Buffer handles raw bytes
        sock.on("data", chunk => {
            res = Buffer.concat([res, chunk]);

            // Parsing length
            const pos = res.indexOf(' ');
            if (len === null && pos !== -1) {
                len = parseInt(res.subarray(0, pos).toString());
                // Extract substring after space
                res = res.subarray(pos + 1);
            }

            // When finished reading all
            if (len !== null && len <= res.length) {

                // Close socket and other events
                sock.end();
                sock.removeAllListeners();

                let result = res.subarray(0, len).toString();
                if (result.startsWith("500")) return reject(new Error(result));
                // Remove the status msg and the last '\n'
                const index = result.indexOf("\n\n");
                result = (index === -1) ? "" : result.slice(index + 2).slice(0, -1);
                resolve(result);
            }

        });

        sock.on("error", reject);
        sock.on("close", reject);
        sock.on("end", reject);
        sock.on('timeout', () => { resolve(res.toString()); });
    });
}

const getMetadata = (id) => filesystem.find(a => a.id === id);

async function createFile(name, content, isFolder, parentId) {

    // Generate a unique ID
    let id;
    while (getMetadata(id = crypto.randomUUID()));

    // Add new item to array
    if (parentId === null) parentId = rootId;
    const newItem = { id, name, isFolder, parentId, content: [], permissions: {} };
    filesystem.push(newItem);

    // If it is a folder, update parent
    const parent = getMetadata(parentId);
    if (parent.isFolder) parent.content.push(id);
    
    // If it is a file, save the content on the server
    if (isFolder === false) await sendToServer(`POST ${id} ${content}`);
    return newItem;
}

function getAllFiles() {
    return getMetadata(rootId).content;
}

async function getFile(id) {
    // We use a copy so we don't store the content or permissions on the server
    const copy = JSON.parse(JSON.stringify(getMetadata(id)));
    copy.permissions = getPermissions(id);
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

    // Update parents if asked to
    if (parentId === null) parentId = rootId;
    if (parentId) {
        const oldParent = getMetadata(item.parentId);
        oldParent.content.splice(oldParent.content.indexOf(id), 1);
        const newParent = getMetadata(parentId);
        newParent.content.push(id);
        item.parentId = parentId;
    }

    // We also want to return content and permissions
    return getFile(id);
}

async function deleteFile(id) {
    
    const item = getMetadata(id);
    
    // Update parent
    if (item.parentId) {
        const parent = getMetadata(item.parentId);
        if (parent) parent.content.splice(parent.content.indexOf(id), 1);
    }

    // Recursively delete subdir
    if (item.isFolder) {
        for (const child of item.content) {
            await deleteFile(child);
        }
        return;
    }

    // Remove item's metdata, permissions and content
    filesystem.splice(filesystem.findIndex(a => a.id === id), 1);
    deleteAllPermissions(id);
    await sendToServer(`DELETE ${id}`);
}

export {
    getMetadata,
    getAllFiles,
    getFile,
    createFile,
    updateFile,
    deleteFile,
    sendToServer
}