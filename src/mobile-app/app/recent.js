import { View, Image, Text } from 'react-native';
import { FilesList } from '../components/FilesList';
import { styles } from '../styles/emptyFolder.styles';
import { useTheme } from '../components/ThemeContext';
import empty_folder from "../assets/emptyFolderImages/empty_folder_recent.png"

function EmptyFolder() {
    const { theme } = useTheme();

    return (
        <View style={styles.emptyFolder}>
            <Image style={styles.emptyFolderImage} source={empty_folder} />
            {/* Apply themed text color for visibility in dark mode */}
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>No recent files</Text>
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>
                "Time is relative" (Albert Einstein)
            </Text>
        </View>
    )
}

/*
Recent screen shows:
- Owned or shared files recently accessed
- Doesn't show folders
- Shows files from all levels, not just root level
- Doesn't show files that are in trash
- Recently is defined as 'today' and accessed is defined as created \ patched
*/
export default function Recent() {
    const { theme } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <FilesList
                filter={["NOT TRASHED", "ALL LEVELS", "NOT FOLDER", "RECENT"]}
                emptyFolder={<EmptyFolder/>}
                title="Welcome"
            ></FilesList>
        </View>
    );
}