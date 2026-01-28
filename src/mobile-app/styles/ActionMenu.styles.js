import { StyleSheet } from 'react-native';
import { COLORS } from '../styles/Theme'

export const styles = StyleSheet.create({
    menu: {
        backgroundColor: COLORS.actionsMenuColor,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 30,
        paddingHorizontal: 16,
    },
    smallLine: {
        width: 40,
        height: 4,
        marginTop: 15,
        marginBottom: 20,
        borderRadius: 2,
        alignSelf: 'center',
        backgroundColor: 'black',
        opacity: 0.5,
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fileIcon: {
        width: 28,
        height: 28,
        marginBottom: 15,
    },
    fileName: {
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 15,
        marginLeft: 15,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 17
    },
    menuItemIcon: {
        width: 20,
        height: 20,
        marginLeft: 10,
        marginRight: 20,
    },
    menuItemText: {
        fontSize: 17,
    },
    divider: {
        height: 1,
        opacity: 0.8,
        backgroundColor: COLORS.border,
        marginVertical: 5
    },
});