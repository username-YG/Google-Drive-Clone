import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

async function createItem(name, content, isFolder, parentId) {
    const token = sessionStorage.getItem("token");
    
    const body = {
        name,
        isFolder,
        parentId: parentId || null
    };

    if (!isFolder) {
        body.content = content;
    }

    const port = import.meta.env.VITE_WEB_PORT || 3000;
    const response = await fetch(`http://localhost:${port}/api/files`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    if (response.status === 201) {
        const location = response.headers.get("location");
        if (location) {
            const path = location.split('/');
            return path[path.length - 1];
        }
    }

    return null;
}

function UploadController({ children, reload, setReload }) {
    const fileInputRef = useRef(null);
    const folderInputRef = useRef(null);
    const navigate = useNavigate();
    
    const { folderId } = useParams();

    const uploadFile = () => {
        fileInputRef.current.click();
    };

    const uploadFolder = () => {
        folderInputRef.current.click();
    };

    const refreshAndRedirect = () => {
        const url = window.location.href;
        if (!url.includes("/folders") && !url.includes("/my-drive")) {
            navigate("/my-drive");
        }
        setReload(!reload);
    };

    const readFile = (file) => {
        return new Promise((resolve, reject) => {
            const type = file.name.split('.').pop().toLowerCase();
            if (type === 'txt') {
                resolve(file.text());
            } else {
                const reader = new FileReader();
                reader.onload = (e) => {
                    let result = e.target.result;
                    const mimeMap = {
                        'pdf': 'application/pdf',
                        'png': 'image/png',
                        'jpg': 'image/jpeg',
                        'jpeg': 'image/jpeg'
                    };
                    const trueMime = mimeMap[type];
                    if (trueMime) {
                        result = result.replace(/^data:[^;]*;/, `data:${trueMime};`);
                    }
                    resolve(result);
                };
                reader.onerror = (e) => reject(e);
                reader.readAsDataURL(file);
            }
        });
    };

    const handleFileSelected = async (e) => {
        const files = Array.from(e.target.files).sort((a, b) =>
            a.webkitRelativePath.localeCompare(b.webkitRelativePath)
        );
        const parentId = folderId || null;
        e.target.value = "";

        for (const file of files) {
            const content = await readFile(file);
            await createItem(file.name, content, false, parentId);
        }

        refreshAndRedirect();
    };

    const handleFolderSelected = async (e) => {
        const files = Array.from(e.target.files).sort((a, b) =>
            a.webkitRelativePath.localeCompare(b.webkitRelativePath)
        );
        const parentId = folderId || null;
        e.target.value = "";
        
        const createdFolders = new Map();

        for (const file of files) {
            const path = file.webkitRelativePath; 
            const pathParts = path.split('/');
            
            const folders = pathParts.slice(0, -1);
            const fileName = pathParts[pathParts.length - 1];
            
            let currentParentId = parentId;
            let cwd = "";

            for (const folderName of folders) {
                cwd = cwd ? `${cwd}/${folderName}` : folderName;

                if (createdFolders.has(cwd)) {
                    currentParentId = createdFolders.get(cwd);
                } else {
                    const newFolderId = await createItem(folderName, null, true, currentParentId);
                    
                    if (newFolderId) {
                        createdFolders.set(cwd, newFolderId);
                        currentParentId = newFolderId;
                    }
                }
            }

            const content = await readFile(file);
            await createItem(fileName, content, false, currentParentId);
        }

        refreshAndRedirect();
    };

    return (
        <>
            {children({ uploadFile, uploadFolder })}

            <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={handleFileSelected}
            />

            <input
                ref={folderInputRef}
                type="file"
                webkitdirectory="true"
                style={{ display: "none" }}
                onChange={handleFolderSelected}
            />
        </>
    );
}

export default UploadController
