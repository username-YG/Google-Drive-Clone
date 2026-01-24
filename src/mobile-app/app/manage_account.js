import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/manage_account.styles';
import { useRouter } from 'expo-router';
import { useState, useEffect } from "react"
import { getUser } from "./serverLogic.js"

export default function ManageAccount() {

    const [user, setUser] = useState(null);
    useEffect(() => {
        getUser(setUser)
    }, []);

    // User details
    const username = user?.username;
    const displayName = user?.displayName;
    const profilePic = user?.profilePic || "";
    if (!username && !displayName) { return (<></>) }

    const router = useRouter();
    return (
        <View style={styles.screen}>
            <Text style={styles.username}>{username}</Text>
            {profilePic ? (
                <Image style={styles.profileImage} source={{ uri: profilePic }} />
            ) : (
                <Text style={styles.noProfileImage}>{displayName ? displayName[0] : "?"}</Text>
            )}
            <Text style={styles.displayName}>Hi, {displayName}!</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/login/username')}>
                <Text style={styles.logoutText}>Log out of this account</Text>
            </TouchableOpacity>
        </View>
    );
}