import { TouchableOpacity, Image, Text } from 'react-native';
import { styles } from '../styles/ProfileButton.styles.js';

export default function ProfileButton({ router }) {

    // User details
    const user = undefined;
    const displayName = user?.displayName || "";
    const profilePic = user?.profilePic || "";

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