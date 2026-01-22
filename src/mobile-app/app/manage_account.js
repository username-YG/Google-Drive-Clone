import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/manage_account.styles';
import { useRouter } from 'expo-router';

export default function ManageAccount() {

    // User details
    const user = undefined;
    const username = user?.username || "";
    const displayName = user?.displayName || "";
    const profilePic = user?.profilePic || "";

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
            <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/login')}>
                <Text style={styles.logoutText}>Log out of this account</Text>
            </TouchableOpacity>
        </View>
    );
}