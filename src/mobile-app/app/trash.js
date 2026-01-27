import { View, Image, Text } from 'react-native';
import { FilesList } from '../components/FilesList';
import { styles } from '../styles/emptyFolder.styles';
import { useTheme } from '../components/ThemeContext';
import empty_folder from "../assets/emptyFolderImages/empty_folder_trash.png"

function EmptyFolder() {
    const { theme } = useTheme();

    return (
        <View style={styles.emptyFolder}>
            <Image style={styles.emptyFolderImage} source={empty_folder} />
            {/* Apply themed text color for visibility in dark mode */}
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>Trash is empty</Text>
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>Press 'delete' key to remove</Text>
        </View>
    )
}

export default function Trash() {
    const { theme } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <FilesList
                filter={["TRASHED", "ALL LEVELS"]}
                emptyFolder={<EmptyFolder/>}
                title="Trash"
            ></FilesList>
        </View>
    );
}