import { useCallback, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getFile } from '../_serverLogic';
import TopBarButton from '../components/TopBarButton';
import dots from "../assets/icons/dots.png";
import backIcon from "../assets/icons/back.png";
import { styles } from '../styles/viewerStyles';
import { ActionMenu } from "../components/ActionMenu.js"
import { useTheme } from '../components/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';

export default function File_viewer() {
    const { fileId } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [actionsOpen, setActionsOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [reload, setReload] = useState(false);
    const router = useRouter();
    const { theme } = useTheme();

    const fileType = file?.name.split('.').pop();
    const isImage = ['jpg', 'jpeg', 'png'].includes(fileType?.toLowerCase());
    const isText = fileType?.toLowerCase() === 'txt';


    // Get the file to display
    const loadFile = async () => {
        try {
            const data = await getFile(fileId, "true");
            if (data) setFile(data);
            setLoading(false);
        } catch (error) {
            console.error("File Load Error:", error);
            setLoading(false);
        }
    };

    // Load when screen opens and when a dependency change
    useFocusEffect(useCallback(() => { loadFile(); }, [fileId, reload]));

    if (loading) return (
        <View style={[styles.container, isImage ? styles.blackBg : { backgroundColor: theme.background }, styles.center]}>
            <ActivityIndicator size="large" color={isImage ? "#fff" : theme.hard_selected} />
        </View>
    );

    return (
        <View style={[styles.container, isImage ? styles.blackBg : { backgroundColor: theme.background }]}>
            <View style={[styles.topBar, isImage ? styles.blackTopBar : { backgroundColor: theme.closedSearchBar, borderBottomColor: theme.border }]}>
                <View style={styles.leftSection}>
                    <TopBarButton
                        router={router}
                        img={backIcon}
                        target="../"
                        iconStyle={isImage ? { tintColor: '#fff' } : { tintColor: theme.text }}
                    />
                    <Text style={[styles.headerTitle, isImage ? styles.whiteText : { color: theme.text }]} numberOfLines={1}>
                        {file?.name || ""}
                    </Text>
                </View>
                <TouchableOpacity onPress={(e) => { e.stopPropagation(); setActionsOpen(true); }} style={styles.menuButton}>
                    <Image source={dots} style={[styles.menuIcon, (isImage || isText) && { tintColor: isImage ? '#fff' : theme.text }]} />
                </TouchableOpacity>
            </View>

            <View style={styles.viewer}>
                {isText && (
                    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.textContainer}>
                        <Text style={[styles.textContent, { color: theme.text }]}>{file?.content}</Text>
                    </ScrollView>
                )}

                {isImage && file?.content && (
                    <Image
                        source={{ uri: (file?.content).startsWith('data:') ? (file?.content) : `data:image/png;base64,${file?.content}` }}
                        style={styles.fullImage}
                        resizeMode="contain"
                    />
                )}
                { (!isImage && !isText) && (
                    <Text style={[styles.unsupportedMsg, { color: theme.text }]}>No preview available</Text>
                )}
            </View>

            <Modal animationType="slide" transparent={true} visible={actionsOpen} onRequestClose={() => setActionsOpen(false)} >
                <TouchableOpacity style={styles.blackBackground} activeOpacity={1} onPress={() => setActionsOpen(false)}>
                    <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                        <ActionMenu file={file} close={() => { setActionsOpen(false); setReload(!reload); }} />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}