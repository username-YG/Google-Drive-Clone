import { StyleSheet } from 'react-native';
import { COLORS } from './Theme';

export const styles = StyleSheet.create({
    blackBackground: {
        flex: 1,
        backgroundColor: '#00000055',
        justifyContent: 'center',
        alignItems: 'center',
    },
    window: {
        maxHeight: '100%',
        width: 300,
        backgroundColor: COLORS.actionsMenuColor,
        borderRadius: 28,
        padding: 24,
    },
    title: {
        marginBottom: 16,
        fontSize: 24,
    },
    usersList: {
        flexGrow: 0,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    userProfileImage: {
        width: 50,
        height: 50,
        marginRight: 16,
        borderRadius: 25,
    },
    noProfileImage: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        borderRadius: 25,
        backgroundColor: COLORS.noProfile,
    },
    noProfileText: {
        color: 'white',
        fontSize: 24,
        fontWeight: '500',
        textAlign: 'center',
    },
    userProfile: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    userDisplayName: {
        fontSize: 18,
    },
    userUsername: {
        fontSize: 16,
    },
    userRole: {
        fontSize: 14,
    },
    buttons: {
        justifyContent: 'center',
        marginTop: 16,
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '500',
        alignSelf: 'center',
        color: COLORS.hard_selected,
    },
    roleChoise: {
        fontSize: 18,
    },
});