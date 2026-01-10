import { useRef } from "react";
import { useNavigate } from "react-router-dom";

// Import Popup logic to use its fetches

const folderCache = new Map();

async function createFolder(path, rootId) {
    if (folderCache.has(path)) {
        return folderCache.get(path);
    }

    const token = localStorage.getItem("token");
    const parts = path.split("/")
    let parentId = rootId
    let cwd = ""

    for (const part of parts) {
        cwd = cwd ? `${cwd}/${part}` : part;

        if (!folderCache.has(cwd)) {
            try {
                const response = await fetch("http://localhost:3000/api/files", {
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
                    const data = await response.json();
                    folderCache.set(cwd, data.id);
                    parentId = data.id;
                } else {}
            } catch (err) {}
        } else {
            parentId = folderCache.get(cwd);
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
    for (const file of files) {
        let parentId = null;
        if (isFolder) {
            const parts = file.webkitRelativePath.split("/");
            const folders = parts.slice(0, -1);
            
            parentId = await createFolder(folders.join("/"), null);
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
