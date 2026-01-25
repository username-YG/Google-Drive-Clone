import { TouchableOpacity, Image, Text } from 'react-native';
import { styles } from '../styles/ProfileButton.styles.js';
import { useState, useEffect } from "react"
import { getUser } from "../app/serverLogic.js"

export default function ProfileButton({ router }) {

    const [user, setUser] = useState(null);
    useEffect(() => {
        getUser(setUser)
    }, []);

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
                <Text style={styles.noProfileImage}>{displayName ? displayName[0] : "?"}</Text>
            )}
        </TouchableOpacity>
    );
}