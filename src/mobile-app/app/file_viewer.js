import { useEffect, useState } from 'react';
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

export default function File_viewer() {
    const { fileId } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [actionsOpen, setActionsOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [reload, setReload] = useState(false);
    const router = useRouter();

    const fileType = file?.name.split('.').pop();
    const isImage = ['jpg', 'jpeg', 'png'].includes(fileType?.toLowerCase());
    const isText = fileType?.toLowerCase() === 'txt';

    // Get the file to display
    useEffect(() => {
        const loadFile = async () => {
            if (fileType?.toLowerCase() === 'pdf') {
                setLoading(false);
                return;
            }
            try {
                const data = await getFile(fileId, "true");
                if (data) setFile(data);
                setLoading(false);
            } catch (error) {
                console.error("File Load Error:", error);
                setLoading(false);
            }
        };
        loadFile();
    }, [fileId, reload]);

    if (loading) return (
        <View style={[styles.container, isImage && styles.blackBg, styles.center]}>
            <ActivityIndicator size="large" color={isImage ? "#fff" : "#4285F4"} />
        </View>
    );

    return (
        <View style={[styles.container, isImage && styles.blackBg]}>
            <View style={[styles.topBar, isImage && styles.blackTopBar]}>
                <View style={styles.leftSection}>
                    <TopBarButton
                        router={router}
                        img={backIcon}
                        target="../"
                        iconStyle={isImage ? { tintColor: '#fff' } : {}}
                    />
                    <Text style={[styles.headerTitle, isImage && styles.whiteText]} numberOfLines={1}>
                        {file.name}
                    </Text>
                </View>
                <TouchableOpacity onPress={(e) => { e.stopPropagation(); setActionsOpen(true); }} style={styles.menuButton}>
                    <Image source={dots} style={[styles.menuIcon, isImage && { tintColor: '#fff' }]} />
                </TouchableOpacity>
            </View>

            <View style={styles.viewer}>
                {isText && (
                    <ScrollView style={styles.whiteBg} contentContainerStyle={styles.textContainer}>
                        <Text style={styles.textContent}>{file.content}</Text>
                    </ScrollView>
                )}

                {isImage && (
                    <Image
                        source={{ uri: (file.content)?.startsWith('data:') ? (file.content) : `data:image/png;base64,${file.content}` }}
                        style={styles.fullImage}
                        resizeMode="contain"
                    />
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