import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Platform,
    ActionSheetIOS,
    Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getFiles } from '../_serverLogic';
import TopBarButton from '../components/TopBarButton';
import dots from "../assets/icons/dots.png";
import backIcon from "../assets/icons/back.png";
import { styles } from '../styles/viewerStyles';

export default function File_viewer() {
    const { fileId, fileName, fileType } = useLocalSearchParams();
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const isImage = ['jpg', 'jpeg', 'png'].includes(fileType?.toLowerCase());
    const isText = fileType?.toLowerCase() === 'txt';

    useEffect(() => {
        const loadFile = async () => {
            if (fileType?.toLowerCase() === 'pdf') {
                setLoading(false);
                return;
            }
            try {
                const data = await getFiles(`/files/${fileId}`, [], router, "true");
                if (data) setContent(data.content);
                setLoading(false);
            } catch (error) {
                console.error("File Load Error:", error);
                setLoading(false);
            }
        };
        loadFile();
    }, [fileId]);

    const showOptions = () => {
        const options = ['Cancel', 'Rename', 'Share', 'Move to', 'Add to Starred', 'Move to Trash', 'Download'];
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                { options, cancelButtonIndex: 0, destructiveButtonIndex: 5, title: fileName },
                (index) => { if (index !== 0) console.log(`Action: ${options[index]}`); }
            );
        } else {
            Alert.alert(fileName, "Select an option", options.slice(1).map(opt => ({
                text: opt,
                onPress: () => console.log(`Action: ${opt}`),
                style: opt === 'Move to Trash' ? 'destructive' : 'default'
            })));
        }
    };

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
                        {fileName}
                    </Text>
                </View>
                <TouchableOpacity onPress={showOptions} style={styles.menuButton}>
                    <Image source={dots} style={[styles.menuIcon, isImage && { tintColor: '#fff' }]} />
                </TouchableOpacity>
            </View>

            <View style={styles.viewer}>
                {isText && (
                    <ScrollView style={styles.whiteBg} contentContainerStyle={styles.textContainer}>
                        <Text style={styles.textContent}>{content}</Text>
                    </ScrollView>
                )}

                {isImage && (
                    <Image
                        source={{ uri: content?.startsWith('data:') ? content : `data:image/png;base64,${content}` }}
                        style={styles.fullImage}
                        resizeMode="contain"
                    />
                )}
            </View>
        </View>
    );
}