import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    emptyFolder: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 100,
    },
    emptyFolderImage: {
        height: 250,
        width: 250,
        resizeMode: 'contain',
    },
    emptyFolderText: {
        margin: 0,
        fontSize: 18,
        paddingHorizontal: 25,
        textAlign: 'center'
    }
});