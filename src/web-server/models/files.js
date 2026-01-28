const net = require('net');
const crypto = require('crypto');
const { FileModel } = require('../database');
const { getPermissions, deleteAllPermissions } = require('./permissions');

const sendToServer = (msg) => {
    return new Promise((resolve, reject) => {

        // Send message to server
        // Use environment variables for Docker networking, fallback to process args
        const ip = process.env.STORAGE_HOST;
        const port = +(process.env.APP_PORT);
        const sock = net.connect(port, ip, () => sock.write(`${Buffer.byteLength(msg)} ${msg}`));
        sock.setTimeout(20000); // 20 sec before we give up

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

async function getMetadata(id) {
    return await FileModel.findOne({ id });
}

async function createFile(name, content, isFolder, parentId) {

    // Generate a unique ID
    let id;
    while (true) {
        id = crypto.randomUUID();
        const exists = await getMetadata(id);
        if (!exists) break;
    }

    // Add new item to array
    if (parentId === null) {
        const root = await FileModel.findOne({ parentId: null });
        parentId = root ? root.id : null;
    }

    const newItem = new FileModel({
        id,
        name,
        isFolder,
        parentId,
        content: [],
        trashed: false,
        starred: [],
        timestamp: new Date()
    });
    await newItem.save();

    // If it is a folder, update parent
    const parent = await getMetadata(parentId);
    if (parent && parent.isFolder) {
        await FileModel.findOneAndUpdate(
            { id: parentId },
            { $push: { content: id } }
        );
    }

    // If it is a file, save the content on the server
    if (isFolder === false) await sendToServer(`POST ${id} ${content}`);
    return newItem;
}

async function getAllFiles() {
    const root = await FileModel.findOne({ parentId: null });
    return root ? root.content : [];
}

async function getAllIDs() {
    const files = await FileModel.find({}, 'id');
    return files.map(file => file.id);
}

async function getFile(id, withContent) {
    if (withContent) {
        await FileModel.findOneAndUpdate({ id }, { timestamp: new Date() });
    }
    // We use a copy so we don't store the content or permissions on the server
    const item = await getMetadata(id);
    if (!item) return null;

    const copy = item.toObject();
    copy.permissions = await getPermissions(id);
    if (copy.isFolder === false && withContent !== false) copy.content = await sendToServer(`GET ${id}`);
    return copy;
}

async function updateFile(id, name, content, parentId, userId, trashed, starred, timestamp) {

    const item = await getMetadata(id);
    if (!item) return null;

    // Update name if asked to
    if (name) {
        item.name = name;
    }

    // Update trashed if asked to
    if (trashed !== undefined) {
        item.trashed = trashed;
    }

    // Update starred if asked to
    if (starred !== undefined) {
        if (starred) {
            if (!item.starred.includes(userId)) {
                item.starred.push(userId);
            }
        } else {
            item.starred = item.starred.filter(id => id !== userId);
        }
    }

    // Update content if asked to
    // Attempting to change folder content is invalid and ignored
    if (content !== undefined && !item.isFolder) {
        await sendToServer(`DELETE ${id}`);
        await sendToServer(`POST ${id} ${content}`);
    }

    // Update parents if asked to
    if (parentId === null) {
        const root = await FileModel.findOne({ parentId: null });
        parentId = root ? root.id : null;
    }

    if (parentId && item.parentId !== parentId) {
        const oldParent = await getMetadata(item.parentId);
        if (oldParent) {
            await FileModel.findOneAndUpdate(
                { id: item.parentId },
                { $pull: { content: id } }
            );
        }
        const newParent = await getMetadata(parentId);
        if (newParent) {
            await FileModel.findOneAndUpdate(
                { id: parentId },
                { $push: { content: id } }
            );
        }
        item.parentId = parentId;
    }

    // Update the timestamp
    if (timestamp !== undefined) {
        item.timestamp = timestamp;
    } else {
        item.timestamp = new Date();
    }

    await item.save();

    // We also want to return content and permissions
    return await getFile(id);
}

async function deleteFile(id) {

    const item = await getMetadata(id);
    if (!item) return;

    // Update parent
    if (item.parentId) {
        await FileModel.findOneAndUpdate(
            { id: item.parentId },
            { $pull: { content: id } }
        );
    }

    // Recursively delete subdir
    if (item.isFolder) {
        // We copy because deleteFile changes item.content
        const children = item.content.slice();
        for (const child of children) {
            await deleteFile(child);
        }
    }

    // Remove item's metdata, permissions and content
    await FileModel.deleteOne({ id });
    await deleteAllPermissions(id);
    if (item.isFolder === false) await sendToServer(`DELETE ${id}`);
}

module.exports = {
    getMetadata,
    getAllFiles,
    getFile,
    createFile,
    updateFile,
    deleteFile,
    sendToServer,
    getAllIDs
};