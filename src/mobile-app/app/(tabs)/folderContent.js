import { View, Image, Text } from 'react-native';
import { FilesList } from '../../components/FilesList';
import { styles } from '../../styles/emptyFolder.styles';
import { useTheme } from '../../components/ThemeContext';
import empty_folder from "../../assets/emptyFolderImages/empty_folder_home.png"
import { useLocalSearchParams } from 'expo-router';

function EmptyFolder() {
    const { theme } = useTheme();

    return (
        <View style={styles.emptyFolder}>
            <Image style={styles.emptyFolderImage} source={empty_folder} />
            {/* Set text color based on active theme */}
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>This folder is empty</Text>
        </View>
    )
}

/*
This screen shows the contents of a clicked folder
*/
export default function FolderContent() {
    const { folderName, folderId } = useLocalSearchParams();
    const { theme } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <FilesList
                folderId={folderId}
                filter={["OWNS", "NOT TRASHED"]}
                emptyFolder={<EmptyFolder/>}
                title={folderName}
            ></FilesList>
        </View>
    );
}