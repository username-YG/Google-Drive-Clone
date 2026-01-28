import { View, Image, Text } from 'react-native';
import { FilesList } from '../../components/FilesList';
import { styles } from '../../styles/emptyFolder.styles';
import { useTheme } from '../../components/ThemeContext';
import empty_folder from "../../assets/emptyFolderImages/empty_folder_starred.png"

function EmptyFolder() {
    const { theme } = useTheme();

    return (
        <View style={styles.emptyFolder}>
            <Image style={styles.emptyFolderImage} source={empty_folder} />
            {/* Dynamic text color for dark mode visibility */}
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>No starred files</Text>
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>Twinkle twinkle little star</Text>
        </View>
    )
}

/*
Starred screen shows:
- Starred files and folders
- Items from all levels, not just root level
- Doesn't show items that are in trash 
*/
export default function Starred() {
    const { theme } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <FilesList
                filter={["STARRED", "NOT TRASHED", "ALL LEVELS"]}
                emptyFolder={<EmptyFolder/>}
                title="Starred"
            ></FilesList>
        </View>
    );
}