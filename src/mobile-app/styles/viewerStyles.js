import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    blackBg: {
        backgroundColor: '#000'
    },
    whiteBg: {
        backgroundColor: '#fff'
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#eee',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',

        paddingTop: 25,
        paddingBottom: 5,
        paddingHorizontal: 15,
    },
    blackTopBar: {
        backgroundColor: '#000',
        borderBottomColor: '#333'
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginLeft: 15,
        color: '#3c4043',
        maxWidth: '80%'
    },
    whiteText: {
        color: '#fff'
    },
    menuButton: {
        padding: 5
    },
    menuIcon: {
        width: 22,
        height: 22,
        tintColor: '#5f6368'
    },
    viewer: {
        flex: 1
    },
    textContainer: {
        padding: 20
    },
    textContent: {
        fontSize: 14,
        lineHeight: 20,
        color: '#000',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
    },
    fullImage: {
        width: '100%',
        height: '100%'
    },
    blackBackground: {
        flex: 1,
        backgroundColor: '#00000055',
        justifyContent: 'flex-end',
    },
});