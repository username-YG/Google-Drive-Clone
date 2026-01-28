import { useState, useRef } from 'react';
import { useGlobalSearchParams, usePathname, useRouter } from 'expo-router';
import { View, Image, Text, TouchableOpacity, Animated, Pressable, DeviceEventEmitter } from 'react-native';
import { styles } from '../styles/PlusButton.styles.js';
import UploadController from './UploadController.js';
import { createFolder } from "../_serverLogic.js"
import { TextInsertBox } from "./TextInsertBox.js"
import { useTheme } from './ThemeContext';

export default function PlusBtn() {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
    const { uploadFile } = UploadController();
    const [createFolderOpen, setCreateFolderOpen] = useState(false)
    const { folderId } = useGlobalSearchParams();

    // Create folder and go to files page
    const pathname = usePathname();
    const router = useRouter();
    const onCreateFolder = async (name) => {
        await createFolder(name, folderId);
        DeviceEventEmitter.emit('reload');
        setCreateFolderOpen(false);
        toggleMenu();
        if (pathname !== '/' && pathname !== '/home' && pathname !== '/folderContent') router.replace('/files');
    }

    const toggleMenu = () => {
        const toValue = open ? 0 : 1;
        Animated.spring(animation, {
            toValue,
            tension: 20,
            friction: 7,
            useNativeDriver: true,
        }).start();
        setOpen(!open);
    }

    const plusBtnStyle = {
        opacity: animation.interpolate({
            inputRange: [0,0.5],
            outputRange: [1,0]
        }),
        transform: [{ scale: animation.interpolate({
                inputRange: [0,1],
                outputRange: [1,0.5]
            })}],
    };

    const xBtnStyle = {
        opacity: animation,
        transform: [{ scale: animation }],
    };

    const menuStyle = (y) => ({
        opacity: animation,
        transform: [
            { translateY: animation.interpolate({
                    inputRange: [0,1],
                    outputRange: [0,y]
                })}
        ],
    });

    return (
        <View style={styles.wrapper} pointerEvents="box-none">
            {open && (
                <Pressable
                    style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
                    onPress={toggleMenu}
                />
            )}

            <View style={styles.menuWrapper} pointerEvents="box-none">
                {/* Apply themed background to menu items */}
                <Animated.View style={[styles.menuItem, menuStyle(-110), { backgroundColor: theme.light_selected }]}>
                    <TouchableOpacity
                        onPress={uploadFile}
                        style={styles.itemButton}
                        activeOpacity={0.7}
                    >
                        {/* Tint the upload icon to match themed text */}
                        <Image
                            style={[styles.itemIcon, { tintColor: theme.text }]}
                            source={require("../assets/icons/upload.png")}
                            resizeMode="contain"
                        />
                        <Text style={[styles.itemText, { color: theme.text }]}>Upload</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.menuItem, menuStyle(-60), { backgroundColor: theme.light_selected }]}>
                    <TouchableOpacity
                        onPress={() => setCreateFolderOpen(true)}
                        style={styles.itemButton}
                        activeOpacity={0.7}
                    >
                        <Image
                            style={styles.itemIcon}
                            source={require("../assets/mimetypes/folder.png")}
                            resizeMode="contain"
                        />
                        <Text style={[styles.itemText, { color: theme.text }]}>Folder</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.closeMenu, xBtnStyle, { backgroundColor: theme.hard_selected }]} pointerEvents={open ? 'auto' : 'none'}>
                    <TouchableOpacity onPress={toggleMenu} style={styles.fullClick}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.openMenu, plusBtnStyle, { backgroundColor: theme.light_selected }]} pointerEvents={open ? 'none' : 'auto'}>
                    <TouchableOpacity onPress={toggleMenu} style={styles.fullClick}>
                        <Text style={[styles.openText, { color: theme.text }]}>+</Text>
                    </TouchableOpacity>
                </Animated.View>

                <TextInsertBox
                    title={"New folder"}
                    doneTitle={"Create"}
                    isOpen={createFolderOpen}
                    setIsOpen={setCreateFolderOpen}
                    onDone={onCreateFolder}
                />

            </View>
        </View>
    );
}