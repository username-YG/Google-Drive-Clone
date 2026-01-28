import * as DocumentPicker from 'expo-document-picker';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system/legacy';
import { useGlobalSearchParams, useRouter, usePathname } from "expo-router";
import Constants from 'expo-constants';
import { DeviceEventEmitter } from 'react-native';

async function createFile(name, content, parentId) {
    const token = SecureStore.getItem("token");

    const body = {
        name,
        isFolder: false,
        content,
        parentId: parentId || null
    };

    // Create the uploaded item
    const hostIp = Constants.expoConfig.hostUri?.split(':')[0];
    const port = Constants.expoConfig.extra?.VITE_WEB_PORT || 3000;

    const response = await fetch(`http://${hostIp}:${port}/api/files`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    // Return its path to handle folder with content upload
    if (response.status === 201) {
        const location = response.headers.get("location");
        if (location) {
            const path = location.split('/');
            return path[path.length - 1];
        }
    }

    return null;
};

const readFile = async (fileUri, fileName) => {
    const type = fileName.split('.').pop().toLowerCase();

    if (type === 'txt') {
        const textContent = await FileSystem.readAsStringAsync(fileUri, {
            encoding: 'utf8',
        });
        return textContent;
    } else {
        const base64Data = await FileSystem.readAsStringAsync(fileUri, {
            encoding: 'base64',
        });

        const mimeMap = {
            'pdf': 'application/pdf',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg'
        };

        const trueMime = mimeMap[type] || 'application/octet-stream';
        return `data:${trueMime};base64,${base64Data}`;
    }
};

function UploadController() {
    const { folderId } = useGlobalSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    
    const uploadFile = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*',
            copyToCacheDirectory: true,
            multiple: true
        });

        if (!result.canceled) {
            const file = result.assets[0];
            const content = await readFile(file.uri, file.name);
            await createFile(file.name, content, folderId);
        }

        if (pathname !== '/' && pathname !== '/home' && pathname !== '/folderContent') router.replace('/files')
        DeviceEventEmitter.emit('reload');
    };

    return ({ uploadFile });
};

export default UploadController