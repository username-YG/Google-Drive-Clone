import { View, Image, Text } from 'react-native';
import { FilesList } from '../../components/FilesList';
import { styles } from '../../styles/emptyFolder.styles';
import { useTheme } from '../../components/ThemeContext';
import empty_folder from "../../assets/emptyFolderImages/empty_folder_home.png"

function EmptyFolder() {
    const { theme } = useTheme();

    return (
        <View style={styles.emptyFolder}>
            <Image style={styles.emptyFolderImage} source={empty_folder} />
            {/* Dynamic text color for dark mode visibility */}
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>Welcome to google drive!</Text>
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>
                This screen shows all your personal and shared files
            </Text>
        </View>
    )
}

/*
The home screen shows:
- Files and folders owned by me
- Files and folders shared with me
- Files from all levels, not just root
- Doesn't show items that are in trash 
*/
export default function Home() {
    const { theme } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <FilesList
                filter={["NOT TRASHED", "ALL LEVELS"]}
                emptyFolder={<EmptyFolder/>}
                title="Welcome"
            />
        </View>
    );
}