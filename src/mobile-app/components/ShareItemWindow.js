import { Modal, TouchableOpacity, ScrollView, View, Text, Image } from "react-native";
import { styles } from "../styles/ShareItemWindow.styles";
import { useState, useEffect } from "react";
import { getUserById } from "../app/serverLogic.js"

const UserListItem = ({ user }) => {
    return (
        <TouchableOpacity style={styles.listItem}>
            
            {user.profilePic ? (
                <Image source={{ uri: user.profilePic }} style={styles.userProfileImage} />
            ) : (
                <View style={styles.noProfileImage}>
                    <Text style={styles.noProfileText}>{(user.displayName) ? (user.displayName[0].toUpperCase()) : "?"}</Text>
                </View>
            )}

            <View style={styles.userProfile}>
                <Text style={styles.userDisplayName} numberOfLines={1}>{user.displayName}</Text>
                <Text style={styles.userUsername} numberOfLines={1}>{user.username}</Text>
                <Text style={styles.userRole}>{user.role}</Text>
            </View>

        </TouchableOpacity>
    );
}

export const ShareItemWindow = ({ isOpen, setIsOpen, file, closeParent }) => {
    
    const [users, setUsers] = useState([]);

    // Load list of users that have access to this item
    useEffect(() => {
        const loadUsers = async (file_) => {
            if (!file_?.permissions) return;
            const permittedUsers = [];
            for (const [userId, role] of Object.entries(file_.permissions)) {
                const data = await getUserById(userId);
                if (data) permittedUsers.push({ ...data, role });
            }
            setUsers(permittedUsers);
        };
        loadUsers(file)
    }, [file])

    return (
        <Modal animationType="fade" transparent={true} visible={isOpen} onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity style={styles.blackBackground} activeOpacity={1} onPress={() => setIsOpen(false)}>
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>

                <View style={styles.window}>
                
                    <Text style={styles.title}>Share "{file.name}"</Text>

                    <ScrollView style={styles.usersList}>

                        {users.map((user) => (
                            <UserListItem key={user.ID} user={user} />
                        ))}

                        <View style={styles.buttons}>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Add user</Text>
                        </TouchableOpacity>
                        </View>

                    </ScrollView>
                
                </View>

            </TouchableOpacity>
        </TouchableOpacity>
        </Modal>
    );
};

export default ShareItemWindow;