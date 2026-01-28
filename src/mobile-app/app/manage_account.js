import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/manage_account.styles';
import { useRouter } from 'expo-router';
import { useState, useCallback } from "react"
import { getUser } from "../_serverLogic.js"
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../components/ThemeContext';

export default function ManageAccount() {
    const { theme } = useTheme(); // Use theme

    const [user, setUser] = useState(null);
    useFocusEffect(
        useCallback(() => {
            getUser(setUser);
        }, [])
    );

    // User details
    const username = user?.username;
    const displayName = user?.displayName;
    const profilePic = user?.profilePic || "";
    if (!username && !displayName) { return (<></>) }

    // Perform logout
    const router = useRouter();
    const logOut = async () => {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("id");
        router.replace('/login/username')
    }

    return (
        <View style={[styles.screen, { backgroundColor: theme.background }]}>
            <Text style={[styles.username, { color: theme.text }]}>{username}</Text>
            {profilePic ? (
                <Image style={styles.profileImage} source={{ uri: profilePic }} />
            ) : (
                <Text style={[styles.noProfileImage, { backgroundColor: theme.noProfile }]}>{displayName ? displayName[0] : "?"}</Text>
            )}
            <Text style={[styles.displayName, { color: theme.text }]}>Hi, {displayName}!</Text>
            <TouchableOpacity style={[styles.logoutButton, { borderColor: theme.border }]} onPress={logOut}>
                <Text style={[styles.logoutText, { color: theme.logoutText }]}>Log out of this account</Text>
            </TouchableOpacity>
        </View>
    );
}