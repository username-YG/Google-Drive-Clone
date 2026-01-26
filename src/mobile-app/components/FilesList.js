import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/FilesList.styles.js';
import { searchItems, getFiles } from "../app/serverLogic.js"
import {useEffect, useState} from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import txt from "../assets/mimetypes/txt.png"
import docs from "../assets/mimetypes/docs.png"
import notype from "../assets/mimetypes/notype.png"
import image from "../assets/mimetypes/image.png"
import pdf from "../assets/mimetypes/pdf.png"
import folder from "../assets/mimetypes/folder.png"

import dots from "../assets/icons/dots.png"
import star from "../assets/icons/selected/star.png"
import people from "../assets/icons/selected/people.png"

const icons = {
  "txt": txt,
  "docs": docs,
  "docx": docs,
  "notype": notype,
  "jpg": image,
  "jpeg": image,
  "png": image,
  "pdf": pdf
}

// Update the grid of files and folders
const updateData = async (folderId, setItems, filter, router, query) => {

  // The url contains the current folder and a query to filter by
  const url = (folderId) ? ("/" + folderId) : ("");
  let data = (query) ? (await searchItems(query)) : (await getFiles("/files" + url, filter, router, "false"));
  if (!data) return;

  // Manually filter trashed because search doesn't
  if (query && filter && filter.includes("NOT TRASHED")) {
    data = data.filter(item => !item.trashed);
  }

  // Folders return list of item ids inside them, we convert each id to its object
  let finalData;
  if (folderId) {
    finalData = await Promise.all(
      data.content.map(async (id) => {
        const item = await getFiles("/files/" + id, filter, router, "false");
        if (item) { item.id = id; }
        return item || id;
      })
    );
  } else {
    finalData = data;
  }

  // Update the grid with the new data
  // By fetching metdata only, without content, we make this function very fast
  finalData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // sort by timestamp decreasing
  setItems(finalData)
}

const ExtraFileData = ({ file }) => {

    // Check user permissions
    const userId = SecureStore.getItem("id");
    const isStarred = file.starred.includes(userId);

    const permissions = file?.permissions || {};
    const role = permissions[userId];
    const doesOwn = (role === "owner");

    const timestamp = new Date(file.timestamp);
    const today = new Date();
    const isToday = timestamp.getDate() === today.getDate() &&
                        timestamp.getMonth() === today.getMonth() &&
                        timestamp.getFullYear() === today.getFullYear();
    const lastAccessed = isToday ?
        "today " + timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) :
        timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <View style={styles.extraData}>
            { isStarred && <Image source={star} style={styles.smallIcon} resizeMode="contain"></Image> }
            { !doesOwn && <Image source={people} style={styles.smallIcon} resizeMode="contain"></Image> }
            <Text style={styles.extraText}>Last access {lastAccessed}</Text>
        </View>
    );
}

const FileListItem = ({ file, selected, onSelect, reload, setReload }) => {
    const router = useRouter();
    // The type determines the file's icon
    const type = file.name.split('.').pop();
    const icon = (file.isFolder) ? (folder) : (icons[type] || icons["notype"]);

    const handlePress = () => {
        if (file.isFolder) {
            // Navigate deeper into folders
            router.push({ pathname: '/(tabs)/files', params: { folderId: file.id } });
        } else if (type === 'pdf') {
            return;
        }  else {
            // Open the file viewer for text, images, or PDFs
            router.push({
                pathname: '/file_viewer',
                params: {
                    fileId: file.id,
                    fileName: file.name,
                    fileType: type
                }
            });
        }
    };

    return (
        <TouchableOpacity style={styles.box} onPress={handlePress}>
            <View style={styles.iconBox}>
                <Image source={icon} style={styles.fileIcon} resizeMode="contain"></Image>
            </View>
            <View style={styles.textList}>
                <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                <ExtraFileData file={file}></ExtraFileData>
            </View>
            <Image source={dots} style={styles.sideIcon} resizeMode="contain"></Image>
        </TouchableOpacity>
    )
}

export const FilesList = ({ filter, emptyFolder, title, query }) => {

    //////////////
    const reload = undefined;
    const setReload = undefined;
    /////////////

    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null); // Track currently selected item
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { folderId } = useLocalSearchParams();
    useEffect(() => {
        const loadData = async () => {
            setLoading(true); // Show loading screen
            await updateData(folderId, setItems, filter, router, query);
            setLoading(false); // Hide loading screen
        }
        loadData();
    }, [folderId, reload, query]);

    // We seperate the files and folders on the screen
    const foldersObjects = items.filter(item => item.isFolder === true);
    const filesObjects = items.filter(item => item.isFolder === false);

    const folders = foldersObjects.map((item, i) =>
        <FileListItem
            key={i}
            file={item}
            selected={selected}
            onSelect={() => setSelected(item.id)}
            reload={reload}
            setReload={setReload}
        />
    );

    const files = filesObjects.map((item, i) =>
        <FileListItem
            key={i}
            file={item}
            selected={selected}
            onSelect={() => setSelected(item.id)}
            reload={reload}
            setReload={setReload}
        />
    );

    return (
        <ScrollView>

            { !(items.length === 0) &&
                <View style={styles.titleBox}>
                    <Text style={styles.titleText}>{title}</Text>
                </View>
            }

            { loading ? ( <Text style={styles.loader}>Loading...</Text> ) : ( (items.length === 0) ? ( emptyFolder ) : (
                <View>
                    <View>{folders}</View>
                    <View>{files}</View>
                </View>
            ))}

        </ScrollView>
    );
}