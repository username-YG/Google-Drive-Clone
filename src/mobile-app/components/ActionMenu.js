import { View, Text, Image } from 'react-native';
import { styles } from '../styles/ActionMenu.styles.js';
import { TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { starItem } from "../app/serverLogic.js";

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

    // The type determines the file's icon
    const type = file.name.split('.').pop();
    const icon = (file.isFolder) ? (folder) : (icons[type] || icons["notype"]);

    // Check user permissions
    const userId = SecureStore.getItem("id");
    const permissions = file?.permissions || {};
    const role = permissions[userId];
    const canPatch = (role === "owner" || role === "writer");
    const doesOwn = (role === "owner");

    const isStarred = file.starred.includes(userId);
    const inTrash = file.trashed;

    return (
        <View style={styles.menu}>

            <View style={styles.smallLine} />
            <View style={styles.title}>
                <Image source={icon} style={styles.fileIcon} resizeMode="contain"></Image>
                <Text style={styles.fileName}>{file.name}</Text>
            </View>

            { inTrash ? (

                <View>
                    <MenuItem icon={restore} text="Restore" whenDisabled={!doesOwn} />
                    <MenuItem icon={delete_forever} text="Delete forever" whenDisabled={!doesOwn} />
                </View>

            ) : (

                <View>
                    <MenuItem icon={pencil} text="Rename" whenDisabled={!canPatch} />
                    <View style={styles.divider}/>
                    <MenuItem icon={people} text="Share" whenDisabled={!doesOwn} />
                    <MenuItem icon={folder} text="Move to" whenDisabled={!doesOwn} />
                    <View style={styles.divider}/>

                    { isStarred ?
                        <MenuItem
                            icon={star_selected}
                            text="Remove from starred"
                            whenDisabled={false}
                            onPress={async() => {await starItem(file.id, false); close(); }}
                        />
                        :
                        <MenuItem
                            icon={star}
                            text="Star"
                            whenDisabled={false}
                            onPress={async() => {await starItem(file.id, true); close(); }}
                        />
                    }
                    
                    <MenuItem icon={trash} text="Move to trash" whenDisabled={false} />
                </View>

            )}
            
        </View>
    );
}