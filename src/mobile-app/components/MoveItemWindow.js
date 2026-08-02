import { View, Text, Modal, TouchableOpacity, Image, ScrollView } from "react-native";
import { styles } from "../styles/MoveItemWindow.styles";
import { moveItem, getAllFolders } from "../app/../_serverLogic.js"
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

import folder from "../assets/mimetypes/folder.png"
import driveIcon from "../assets/icons/drive.png"

export const MoveItemWindow = ({ isOpen, setIsOpen, file, closeParent }) => {
  const { theme } = useTheme(); // Access the active theme
  const [folders, setFolders] = useState([]);

  // Do you own this item
  const userId = SecureStore.getItem("id");
  const doesOwn = (item) => {
    const permissions = item?.permissions || {};
    const role = permissions[userId];
    return (role === "owner");
  }

  // Update the list of folders available
  useEffect(() => {
    const updateFolders = async () => {
      const allFolders = await getAllFolders();
      setFolders(allFolders.filter(fold =>
          (fold.id !== file.id) && doesOwn(fold)
      )); // Exculed current and unowned item
    }
    updateFolders();
  }, [file]);

  const onMoveItem = async (newParentId) => {
    await moveItem(file.id, newParentId);
    setIsOpen(false);
    closeParent();
  }

  return (
      <Modal animationType="fade" transparent={true} visible={isOpen} onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity style={styles.blackBackground} activeOpacity={1} onPress={() => setIsOpen(false)}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>

            {/* Apply themed background to the window */}
            <View style={[styles.window, { backgroundColor: theme.actionsMenuColor }]}>

              {/* Apply themed color to the title */}
              <Text style={[styles.title, { color: theme.text }]}>Move "{file?.name}"</Text>

              <ScrollView style={styles.foldersList}>

                <TouchableOpacity style={styles.listItem} onPress={() => onMoveItem(null)}>
                  {/* Apply tint color to the drive icon */}
                  <Image source={driveIcon} style={[styles.icon, { tintColor: theme.text }]} />
                  {/* Apply themed color to the list item text */}
                  <Text style={[styles.listItemText, { color: theme.text }]}>My Storage</Text>
                </TouchableOpacity>

                {folders.map((fold) => (
                    <TouchableOpacity key={fold.id} style={styles.listItem} onPress={() => onMoveItem(fold.id)}>
                      <Image source={folder} style={styles.icon} />
                      {/* Apply themed color to folder names */}
                      <Text style={[styles.listItemText, { color: theme.text }]}>{fold.name}</Text>
                    </TouchableOpacity>
                ))}

                <View style={styles.buttons}>
                  <TouchableOpacity style={styles.button} onPress={() => setIsOpen(false)}>
                    {/* Apply themed color to the button text */}
                    <Text style={[styles.buttonText, { color: theme.hard_selected }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>

              </ScrollView>

            </View>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
  );
};

export default MoveItemWindow;