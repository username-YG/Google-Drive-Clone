import { View, Image, Text } from 'react-native';
import { FilesList } from '../../components/FilesList';
import { styles } from '../../styles/emptyFolder.styles';
import { useTheme } from '../../components/ThemeContext';
import empty_folder from "../../assets/emptyFolderImages/empty_folder_mydrive.png"

function EmptyFolder() {
    const { theme } = useTheme();

    return (
        <View style={styles.emptyFolder}>
            <Image style={styles.emptyFolderImage} source={empty_folder} />
            {/* Apply themed text color to the empty state message */}
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>This folder is empty and sad</Text>
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>Upload something so it won't be sad</Text>
        </View>
    )
}

/*
Files (my drive) screen shows:
- Files and folders owned by me
- Only files and folders on root level
- Doesn't show items that are in trash
*/
export default function Files() {
    const { theme } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <FilesList
                filter={["OWNS", "NOT TRASHED"]}
                emptyFolder={<EmptyFolder/>}
                title="My Drive"
            ></FilesList>
        </View>
    );
}