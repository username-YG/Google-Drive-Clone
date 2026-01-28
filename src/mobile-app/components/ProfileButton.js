import { TouchableOpacity, Image, Text } from 'react-native';
import { styles } from '../styles/ProfileButton.styles.js';
import { useCallback, useState } from "react"
import { getUser } from "../app/../_serverLogic.js"
import { useFocusEffect } from 'expo-router';
import { useTheme } from './ThemeContext';

export default function ProfileButton({ router }) {
    const { theme } = useTheme();
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

    return (
        <TouchableOpacity onPress={() => router.push('/manage_account')}>
            {profilePic ? (
                <Image style={styles.profileImage} source={{ uri: profilePic }} />
            ) : (
                /* Apply themed background color to the no-profile placeholder */
                <Text style={[styles.noProfileImage, { backgroundColor: theme.noProfile }]}>
                    {displayName ? displayName[0] : "?"}
                </Text>
            )}
        </TouchableOpacity>
    );
}