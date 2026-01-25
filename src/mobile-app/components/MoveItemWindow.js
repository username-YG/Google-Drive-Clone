import { View, Text, Modal, TouchableOpacity, Image, ScrollView } from "react-native";
import { styles } from "../styles/MoveItemWindow.styles";
import { moveItem, getAllFolders } from "../app/serverLogic.js"
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';

import folder from "../assets/mimetypes/folder.png"
import driveIcon from "../assets/icons/drive.png"

export const MoveItemWindow = ({ isOpen, setIsOpen, file, closeParent }) => {
  
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

            <View style={styles.window}>
              
              <Text style={styles.title}>Move "{file?.name}"</Text>

              <ScrollView style={styles.foldersList}>
                
                <TouchableOpacity style={styles.listItem} onPress={() => onMoveItem(null)}>
                  <Image source={driveIcon} style={styles.icon} />
                  <Text style={styles.listItemText}>My Drive</Text>
                </TouchableOpacity>

                {folders.map((fold) => (
                  <TouchableOpacity key={fold.id} style={styles.listItem} onPress={() => onMoveItem(fold.id)}>
                    <Image source={folder} style={styles.icon} />
                    <Text style={styles.listItemText}>{fold.name}</Text>
                  </TouchableOpacity>
                ))}

                <View style={styles.buttons}>
                  <TouchableOpacity style={styles.button} onPress={() => setIsOpen(false)}>
                    <Text style={styles.buttonText}>Cancel</Text>
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