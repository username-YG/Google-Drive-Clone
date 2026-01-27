import { View, Text, Image } from 'react-native';
import { useState } from 'react';
import { styles } from '../styles/ActionMenu.styles.js';
import { TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { starItem, trashItem, deleteItem, renameItem } from "../app/../_serverLogic.js";
import { TextInsertBox } from "./TextInsertBox.js"
import { MoveItemWindow } from "../components/MoveItemWindow.js"
import { ShareItemWindow } from "../components/ShareItemWindow.js"
import ShareController from "../components/ShareController.js"

import txt from "../assets/mimetypes/txt.png"
import docs from "../assets/mimetypes/docs.png"
import notype from "../assets/mimetypes/notype.png"
import image from "../assets/mimetypes/image.png"
import pdf from "../assets/mimetypes/pdf.png"
import folder from "../assets/mimetypes/folder.png"

import pencil from "../assets/icons/pencil.png"
import people from "../assets/icons/people.png"
import star from "../assets/icons/star.png"
import star_selected from "../assets/icons/selected/star.png"
import trash from "../assets/icons/trash.png"
import share from "../assets/icons/share.png"

import delete_forever from "../assets/icons/delete_forever.png"
import restore from "../assets/icons/restore.png"

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

const MenuItem = ({ icon, text, whenDisabled, onPress }) => {
    // If the user doesn't have permission the button is disabled
    return (
        <TouchableOpacity
            style={[styles.menuItem, whenDisabled && {opacity: 0.4}]}
            disabled={whenDisabled}
            onPress={onPress}
        >
            <Image source={icon} style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>{text}</Text>
        </TouchableOpacity>
    )
}

export const ActionMenu = ({ file, close }) => {
    if (!file) return;

    // The type determines the file's icon
    const type = file.name.split('.').pop();
    const icon = (file.isFolder) ? (folder) : (icons[type] || icons["notype"]);

    // Check user permissions
    const userId = SecureStore.getItem("id");
    const permissions = file?.permissions || {};
    const role = permissions[userId];
    const canPatch = (role === "owner" || role === "writer");
    const doesOwn = (role === "owner");

    // Check file properties
    const isStarred = file.starred.includes(userId);
    const inTrash = file.trashed;

    // Tracking which popups are opened
    const [renameOpened, setRenameOpened] = useState(false);
    const [moveItemOpened, setMoveItemOpened] = useState(false);
    const [shareItemOpened, setshareItemOpened] = useState(false);

    return (
        <View style={styles.menu}>

            <View style={styles.smallLine} />
            <View style={styles.title}>
                <Image source={icon} style={styles.fileIcon} resizeMode="contain"></Image>
                <Text style={styles.fileName}>{file.name}</Text>
            </View>

            { inTrash ? (

                <View>

                    <MenuItem
                        icon={restore}
                        text="Restore"
                        whenDisabled={!doesOwn}
                        onPress={async() => { await trashItem(file.id, false); close(); }}
                    />

                    <MenuItem
                        icon={delete_forever}
                        text="Delete forever"
                        whenDisabled={!doesOwn}
                        onPress={async() => { await deleteItem(file.id); close(); }}
                    />

                </View>

            ) : (

                <View>

                    <MenuItem
                        icon={pencil}
                        text="Rename"
                        whenDisabled={!canPatch}
                        onPress={() => setRenameOpened(true)}
                    />

                    <MenuItem
                        icon={folder}
                        text="Move to"
                        whenDisabled={!doesOwn}
                        onPress={() => setMoveItemOpened(true)}
                    />

                    <View style={styles.divider}/>

                    <MenuItem
                        icon={people}
                        text="Share"
                        whenDisabled={!doesOwn}
                        onPress={() => setshareItemOpened(true)}
                    />

                    { !(file.isFolder) &&
                        <MenuItem
                            icon={share}
                            text="Send a copy.."
                            whenDisabled={false}
                            onPress={async() => { await ShareController(file.id); close(); }}////////////
                        />
                    }

                    <View style={styles.divider}/>

                    { isStarred ?
                        <MenuItem
                            icon={star_selected}
                            text="Remove from starred"
                            whenDisabled={false}
                            onPress={async() => { await starItem(file.id, false); close(); }}
                        />
                        :
                        <MenuItem
                            icon={star}
                            text="Star"
                            whenDisabled={false}
                            onPress={async() => { await starItem(file.id, true); close(); }}
                        />
                    }
                    
                    <MenuItem
                        icon={trash}
                        text="Move to trash"
                        whenDisabled={false}
                        onPress={async() => { await trashItem(file.id, true); close(); }}
                    />

                </View>

            )}

            { /* Popups */ }

            <TextInsertBox
                title={"Rename " + (file.isFolder ? "folder" : "file")}
                doneTitle={"Rename"}
                isOpen={renameOpened}
                setIsOpen={setRenameOpened}
                onDone={async(newName) => { await renameItem(file.id, newName); setRenameOpened(false); close(); }}
            />

            <MoveItemWindow
                isOpen={moveItemOpened}
                setIsOpen={setMoveItemOpened}
                file={file}
                closeParent={close}
            />
            
            <ShareItemWindow
                isOpen={shareItemOpened}
                setIsOpen={setshareItemOpened}
                file={file}
                closeParent={close}
            />

        </View>
    );
}