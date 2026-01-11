import { useRef } from "react";
import { useNavigate } from "react-router-dom";

// Import Popup logic to use its fetches

const folderCache = new Map();

async function createFolder(path, rootId) {
    const token = localStorage.getItem("token");
    const parts = path.split("/");
    let parentId = rootId;

    for (const part of parts) {
        const key = `${parentId ?? "root"}:${part}`;

        if (folderCache.has(key)) {
            parentId = folderCache.get(key);
            continue;
        }

        // else
        let folderIdFound = null;
        let response = null

        try {
            response = await fetch("http://localhost:3000/api/files", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: part,
                    isFolder: true,
                    parentId
                })
            });

            if (response.status === 201 || response.status === 200) {
                console.log("hello")
                const data = await response.json();
                console.log(data)
                folderIdFound = data.id;
            }
        } catch (err) { }

        if (!folderIdFound) {
            try {
                const url = parentId
                    ? `http://localhost:3000/api/files/${parentId}` 
                    : `http://localhost:3000/api/files`;

                response = await fetch(url, {
                    method: "GET",
                    headers: { 
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 201 || response.status === 200) {
                    const folderData = await response.json();

                    if (parentId) {
                        const subItemsID = folderData.content || [];
                
                        for (const id of subItemsID) {
                            try {
                                const res = await fetch(`/api/files/${id}`, {
                                    method: "GET",
                                    headers: { 
                                        Authorization: `Bearer ${token}`
                                    }
                                });
                                
                                const item = await res.json();

                                if (item.isFolder && item.name === part) {
                                    folderIdFound = item.id;
                                    break;
                                }
                            } catch (err) {}
                        }
                    } else {
                        const subItems = folderData.content;  
                        const match = subItems.find(f => f.name === part && f.isFolder);
                        
                        if (match) {
                            folderIdFound = match.id;
                        }
                    }
                }
            } catch (err) {}
        }

        if (folderIdFound) {
            folderCache.set(key, folderIdFound);
            parentId = folderIdFound;
        } else {
            return null; 
        }
    }
    return parentId;
}

async function createFile(file, parentId) {
    const content = await file.text();
    const token = localStorage.getItem("token");

    try {
        await fetch("http://localhost:3000/api/files", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name: file.name,
                content,
                isFolder: false,
                parentId
            })
        });
    } catch (err) {}
}

async function uploadToServer(files, isFolder) {
    folderCache.clear();

    for (const file of files) {
        let parentId = null;
        if (isFolder && file.webkitRelativePath) {
            const parts = file.webkitRelativePath.split("/");
            const folderPath = parts.slice(0, -1).join("/");
            
            if (folderPath) {
                parentId = await createFolder(folderPath, null);
            }
        }
        
        await createFile(file, parentId);
    }
}

function UploadController({ children, reload, setReload }) {
    const fileInputRef = useRef(null);
    const folderInputRef = useRef(null);
    const navigate = useNavigate();

    const uploadFile = () => {
        fileInputRef.current.click();
    }

    const uploadFolder = () => {
        folderInputRef.current.click();
    }

    const handleFileSelected = async (e) => {
        const file = Array.from(e.target.files);
        await uploadToServer(file, false);
        e.target.value = "";
        const url = window.location.href;
        if (!url.includes("/folders") && !url.includes("/my-drive")) navigate("/my-drive");
        setReload(!reload);
    };

    const handleFolderSelected = async (e) => {
        const folder = Array.from(e.target.files);
        await uploadToServer(folder, true);
        e.target.value = "";
        const url = window.location.href;
        if (!url.includes("/folders") && !url.includes("/my-drive")) navigate("/my-drive");
        setReload(!reload);

    };

    return (
        <>
            {children({ uploadFile, uploadFolder })}

            <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                multiple
                accept=".txt,.doc,.docx,.jpg,.jpeg,.png,.pdf"
                onChange={handleFileSelected}
            />

            <input
                ref={folderInputRef}
                type="file"
                style={{ display: "none" }}
                webkitdirectory={"true"}
                onChange={handleFolderSelected}
            />
        </>
    )
}

export default UploadController
