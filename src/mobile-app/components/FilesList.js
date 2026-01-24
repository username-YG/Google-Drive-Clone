import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/FilesList.styles.js';
import { searchItems, getFiles } from "../app/serverLogic.js"
import { useEffect, useState } from 'react';
import { useRouter, usePathname} from 'expo-router';
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
const updateData = async (folderId, setItems, filter, router, query, setParent) => {

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
    setParent(data.parentId || null);
    finalData = await Promise.all(
      data.content.map(async (id) => {
        const item = await getFiles("/files/" + id, filter, router, "false");
        if (item) { item.id = id; }
        return item || id;
      })
    );
  } else {
    finalData = data;
    setParent(null);
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
    
    // The type determines the file's icon
    const type = file.name.split('.').pop();
    const icon = (file.isFolder) ? (folder) : (icons[type] || icons["notype"]);

    const router = useRouter();
    const onFolderPress = () => {
        if (file.isFolder) {
            router.push({
                pathname: '/folderContent',   
                params: { folderId: file.id, folderName: file.name }
            });
        }
    }
    
    return (
        <TouchableOpacity style={styles.box} onPress={onFolderPress}>
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

export const FilesList = ({ folderId, filter, emptyFolder, title, query }) => {

    //////////////
    const reload = undefined;
    const setReload = undefined;
    /////////////

    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null); // Track currently selected item
    const [loading, setLoading] = useState(false);
    const [parent, setParent] = useState(null);

    const router = useRouter();

    // Reload files when one of those change
    useEffect(() => {
        const loadData = async () => {
            setLoading(true); // Show loading screen
            await updateData(folderId, setItems, filter, router, query, setParent);
            setLoading(false); // Hide loading screen
        }
        loadData();
    }, [folderId, reload, query, setParent]);
    
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

    // When the user goes back, navigate to the parent folder
    const goBack = async () => {
        setLoading(true); // Show loading screen
        const data = await getFiles("/files/" + parent, filter, router, "false");
        setLoading(false); // Show loading screen
        if (data) {
            router.push({
                pathname: "/folderContent",
                params: { folderId: parent, folderName: data.name }
            });
        } else {
            router.navigate("/home"); // When navigating to root folder
        }
    }

    return (
        <ScrollView>

            { (!(items.length === 0) || (folderId)) &&
                <TouchableOpacity onPress={goBack} disabled={!folderId} style={styles.titleBox}>
                    {folderId && ( <Image source={require("../assets/icons/back.png")} style={styles.goBack} />)}
                    <Text style={styles.titleText}>{title}</Text>
                </TouchableOpacity>
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