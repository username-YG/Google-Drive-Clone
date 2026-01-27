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

            <View style={{
                backgroundColor: theme.actionsMenuColor,
                paddingVertical: 30,
                paddingHorizontal: 20,
                borderRadius: 20,
                width: '90%',
                alignItems: 'center',
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                borderWidth: 1,
                borderColor: theme.border + '15',
            }}>
                <Text style={[styles.emptyFolderText, { color: theme.text, fontWeight: 'bold', fontSize: 20, marginBottom: 10 }]}>
                    Welcome to google drive!
                </Text>
                <Text style={[styles.emptyFolderText, { color: theme.text, opacity: 0.7, fontSize: 16 }]}>
                    This screen shows all your personal and shared files
                </Text>
            </View>
        </View>
    )
}

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