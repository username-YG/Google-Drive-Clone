import { Modal, TouchableOpacity, ScrollView, View, Text, Image } from "react-native";
import { styles } from "../styles/ShareItemWindow.styles";
import { useState, useEffect } from "react";
import { getUserById, shareWithUser, updatePermission, unshareWithUser } from "../app/../_serverLogic.js"
import { TextInsertBox } from "./TextInsertBox.js"
import { Alert } from 'react-native';

const UserListItem = ({ user, onPress }) => {
    return (
        <TouchableOpacity style={styles.listItem} onPress={onPress}>
            
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
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const roles = ["owner", "writer", "reader", "commenter", "none"];

    // Load list of users that have access to this item
    const loadUsers = async (file_) => {
        if (!file_?.permissions) return;
        const permittedUsers = [];
        for (const [userId, role] of Object.entries(file_.permissions)) {
            const data = await getUserById(userId);
            if (data) permittedUsers.push({ ...data, role, id: userId });
        }
        setUsers(permittedUsers);
    };

    useEffect(() => {
        loadUsers(file)
    }, [file])

    // Handle sharing the file with a new user
    const handleSharing = async (username) => {
        const msg = await shareWithUser(file.id, username);
        if (msg) {
            Alert.alert("Error", msg);
        } else {
            setIsAddOpen(false);
            closeParent();
        }
    }

    // Handel editing the permissions of an existing user
    const handleEdit = async (role) => {
        if (role === 'none') {
            await unshareWithUser(file.id, selectedUser.id);
        } else {
            await updatePermission(file.id, selectedUser.id, role);
        }
        setSelectedUser(null);
        setIsAddOpen(false);
        closeParent();
    }

    return (
        <Modal animationType="fade" transparent={true} visible={isOpen} onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity style={styles.blackBackground} activeOpacity={1} onPress={() => setIsOpen(false)}>
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>

                <View style={styles.window}>
                
                    <Text style={styles.title}>Share "{file.name}"</Text>

                    <ScrollView style={styles.usersList}>

                        {users.map((user) => (
                            <UserListItem key={user.ID} user={user} onPress={() => setSelectedUser(user)} />
                        ))}

                        <View style={styles.buttons}>
                        <TouchableOpacity style={styles.button} onPress={() => setIsAddOpen(true)}>
                            <Text style={styles.buttonText}>Add user</Text>
                        </TouchableOpacity>
                        </View>

                    </ScrollView>
                
                </View>

            </TouchableOpacity>
        </TouchableOpacity>

        { /* Share with a new user popup */}
        <TextInsertBox
            title="Enter username"
            doneTitle="Share"
            isOpen={isAddOpen}
            setIsOpen={setIsAddOpen}
            onDone={handleSharing}
        />

        { /* Edit user permissions popup */}
        <Modal animationType="fade" transparent={true} visible={!!selectedUser} onRequestClose={() => setSelectedUser(null)}>
            <TouchableOpacity style={styles.blackBackground} activeOpacity={1} onPress={() => setSelectedUser(null)}>
                <View style={styles.window}>
                    <Text style={styles.title}>Choose new role</Text>
                    {roles.map((role) => (
                        <TouchableOpacity key={role} style={styles.listItem} onPress={() => handleEdit(role)}>
                            <Text style={styles.roleChoise}>{role}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>
        </Modal>

        </Modal>
    );
};

export default ShareItemWindow;