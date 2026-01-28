import { View, Image, Text } from 'react-native';
import { FilesList } from '../components/FilesList';
import { styles } from '../styles/emptyFolder.styles';
import { useTheme } from '../components/ThemeContext';
import empty_folder from "../assets/emptyFolderImages/empty_folder_mydrive.png"

function EmptyFolder() {
    const { theme } = useTheme();

    return (
        <View style={styles.emptyFolder}>
            <Image style={styles.emptyFolderImage} source={empty_folder} />
            {/* Apply themed text color for visibility in dark mode */}
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>No uploads</Text>
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>Click the plus button and upload!</Text>
        </View>
    )
}

/*
Uploads screen shows:
- Files you uploaded
- Doesn't show files that are in trash
- Items from all levels, not just root level
*/
export default function Uploads() {
    const { theme } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <FilesList
                filter={["NOT TRASHED", "ALL LEVELS", "NOT FOLDER"]}
                emptyFolder={<EmptyFolder/>}
                title="Uploads"
            ></FilesList>
        </View>
    );
}