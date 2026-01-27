import { View, Image, Text } from 'react-native';
import { FilesList } from '../../components/FilesList';
import { styles } from '../../styles/emptyFolder.styles';
import { useTheme } from '../../components/ThemeContext';
import empty_folder from "../../assets/emptyFolderImages/empty_folder_shared.png"

function EmptyFolder() {
    const { theme } = useTheme();

    return (
        <View style={styles.emptyFolder}>
            <Image style={styles.emptyFolderImage} source={empty_folder} />
            {/* Dynamic text color for dark mode visibility */}
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>You have no shared items</Text>
            <Text style={[styles.emptyFolderText, { color: theme.text }]}>
                Call a friend and ask them to share an item with you
            </Text>
        </View>
    )
}

export default function Shared() {
    const { theme } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <FilesList
                filter={["SHARES", "NOT TRASHED", "ALL LEVELS"]}
                emptyFolder={<EmptyFolder/>}
                title="Shared with me"
            ></FilesList>
        </View>
    );
}