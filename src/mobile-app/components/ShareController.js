import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { getFile } from "../_serverLogic.js"

const getFileMimeType = (file) => {
    const type = file.name.split('.').pop().toLowerCase();

    const mimeMap = {
        'txt': 'text/plain',
        'pdf': 'application/pdf',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg'
    };

    return mimeMap[type] || 'application/octet-stream';
};

const asciiToBase64 = (str) => {
    let binary = '';
    for (let i = 0; i < str.length; i++) {
        binary += String.fromCharCode(str.charCodeAt(i) & 0xff);
    }
    return btoa(binary);
};

async function ShareController(fileId) {
    try {
        const file = await getFile(fileId);

        if (file) {
            const fileUri = FileSystem.documentDirectory + file.name.replace(/[\/\\?%*:|"<>]/g, '-');

            let cleanBase64 = file.content;
            if (cleanBase64.includes(',')) {
                cleanBase64 = cleanBase64.split(',')[1];
            }

            cleanBase64 = cleanBase64.replace(/(\r\n|\n|\r)/gm, "");

            await FileSystem.writeAsStringAsync(fileUri, cleanBase64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            let isReady = false;
            while (!isReady) {
                const info = await FileSystem.getInfoAsync(fileUri);
                if (info.exists && info.size > 0) {
                    isReady = true;
                } else {
                    await new Promise(res => setTimeout(res, 200));
                }
            }

            if (isReady && await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: getFileMimeType(file),
                    UTI: 'public.item'
                });
            }
        }
    } catch (err) {console.log(err)}
};

export default ShareController