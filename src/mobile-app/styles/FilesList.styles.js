import { StyleSheet } from 'react-native';
import { COLORS } from '../styles/Theme'

export const styles = StyleSheet.create({
    titleBox: {
        marginTop: 15,
        marginVertical: 1,
        paddingLeft: 5,
        marginLeft: 7,
        marginRight: 7,
        borderRadius: 5,
        borderTopEndRadius: 15,
        borderTopStartRadius: 15,
        backgroundColor: COLORS.filesListItem,
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 18,
        paddingVertical: 15,
        marginLeft: 7,
    },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        marginVertical: 1,
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
        fontSize: 17,
        paddingBottom: 4,
    },
    extraData: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallIcon: {
        width: 13,
        height: 13,
        opacity: 0.7,
        marginRight: 6,
    },
    extraText: {
        fontSize: 13,
        opacity: 0.7,
    },
    sideIcon: {
        width: 20,
        height: 20,
        opacity: 0.8,
        marginLeft: 12,
    },
    loader: {
        padding: 25,
        fontSize: 22,
        alignSelf: 'center'
    },
    goBack: {
        width: 23,
        height: 23,
        marginLeft: 5,
        marginRight: 10,
        resizeMode: 'contain',
    }
});