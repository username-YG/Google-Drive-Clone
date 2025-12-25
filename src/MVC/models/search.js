const net = require("net")
const FILES = require("./files")

const sendToServer = (msg) => {
    return new Promise((resolve, reject) => {

        // sending message to server
        const ip = process.argv[2];
        const port = +process.argv[3];
        const sock = net.connect(port, ip, () => sock.write(`${msg.length} ${msg}`));

        // getting response from server
        let res = '', len = null, finished = false;
        sock.on("data", chunk => {
            res += chunk.toString();

            // parsing length
            if (len === null && res.includes(" ")) [len, res] = [parseInt(res), res.slice(res.indexOf(" ") + 1)];

            // when finished reading all
            if (!finished && len !== null && len <= res.length) {
                sock.end();
                res = res.slice(0, len);
                if (res.startsWith("500")) reject(new Error(res));
                // removing the status msg
                const index = res.indexOf("\n\n");
                res = (index === -1) ? "" : res.slice(index + 2);
                finished = true;
                resolve(res);
            }
            
        });

        sock.on("error", reject);
        sock.on("close", () => { if (!finished) reject(new Error("Socket closed")); });
        sock.on("end", () => { if (!finished) reject(new Error("Server closed")); });
    });
}

exports.getFiles = async (query) => {
    // getting files or dirs which contian query in their contnet in the cpp "library"
    let msg = `search ${query}`
    const files = await sendToServer(msg)
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