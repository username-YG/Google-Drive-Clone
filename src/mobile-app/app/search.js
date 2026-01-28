import { View, Image, Text } from 'react-native';
import { FilesList } from '../components/FilesList';
import { styles } from '../styles/emptyFolder.styles';
import empty_folder from "../assets/emptyFolderImages/empty_folder_search.png"
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../components/ThemeContext';

function EmptyFolder() {
    const { theme } = useTheme();

    return (
        <View style={styles.emptyFolder}>
            <Image style={styles.emptyFolderImage} source={empty_folder} />
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>No matching results</Text>
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>Try another search</Text>
        </View>
    );
}

/*
Search screen shows:
- Files that contain the query in name \ content
- Folders that contains the query in name
- Shows both shared and owned items
- Shows items from all levels, not just root
- Doesn't show items that are in trash
*/
export default function Search() {
    const { q } = useLocalSearchParams();
    const { theme } = useTheme(); // Use the theme

    if (!q) {
        /* This View covers the screen when the search bar is open but no query is typed yet */
        return (
            <View style={{ flex: 1, backgroundColor: theme.background }} />
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <FilesList
                filter={["ALL LEVELS", "NOT TRASHED"]}
                emptyFolder={<EmptyFolder />}
                title="Search results"
                query={q}
            />
        </View>
    );
}