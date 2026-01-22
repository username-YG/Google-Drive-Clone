import { StyleSheet } from 'react-native';
import { COLORS } from '../styles/Theme'

export const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginLeft: 7,
        marginRight: 7,
        borderRadius: 5,
        backgroundColor: COLORS.filesListItem,
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 13,
        backgroundColor: COLORS.fileIconBox,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fileIcon: {
        width: 26,
        height: 26,
    },
    textList: {
        flex: 1,
        justifyContent: 'center',
    },
    fileName: {
        fontSize: 18,
    },
    extraData: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallIcon: {
        width: 14,
        height: 14,
        tintColor: '#5F6368',
        marginRight: 6,
    },
    extraText: {
        fontSize: 13,
        color: '#5F6368',
    },
    sideIcon: {
        width: 20,
        height: 20,
        tintColor: '#5F6368',
        marginLeft: 12,
    }
});