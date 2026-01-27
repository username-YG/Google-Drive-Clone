import { useState, useRef } from 'react';
import { useGlobalSearchParams, usePathname, useRouter } from 'expo-router';
import { View, Image, Text, TouchableOpacity, Animated, Pressable, DeviceEventEmitter } from 'react-native';
import { styles } from '../styles/PlusButton.styles.js';
import UploadController from './UploadController.js';
import { createFolder } from "../_serverLogic.js"
import { TextInsertBox } from "./TextInsertBox.js"

export default function PlusBtn() {
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
            duration: 250,
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
        <View style={styles.wrapper}>
            {open && (
                <Pressable style={styles.backdrop} onPress={toggleMenu} />
            )}

            <View style={styles.menuWrapper}>
                <Animated.View style={[styles.menuItem, menuStyle(-110)]}>
                    <TouchableOpacity 
                        onPress={uploadFile}
                        style={styles.itemButton}
                        activeOpacity={0.7}
                    >
                        <Image style={styles.itemIcon} source={require("../assets/icons/upload.png")} />
                        <Text style={styles.itemText}>Upload</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.menuItem, menuStyle(-60)]}>
                    <TouchableOpacity 
                        onPress={() => setCreateFolderOpen(true)}
                        style={styles.itemButton}
                        activeOpacity={0.7}
                    >
                        <Image style={styles.itemIcon} source={require("../assets/mimetypes/folder.png")} />
                        <Text style={styles.itemText}>Folder</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.closeMenu, xBtnStyle]} pointerEvents={open ? 'auto' : 'none'}>
                    <TouchableOpacity onPress={toggleMenu} style={styles.fullClick}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.openMenu, plusBtnStyle]} pointerEvents={open ? 'none' : 'auto'}>
                    <TouchableOpacity onPress={toggleMenu} style={styles.fullClick}>
                        <Text style={styles.openText}>+</Text>
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