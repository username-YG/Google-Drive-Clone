import { StyleSheet } from "react-native";
import { COLORS } from "../styles/Theme"

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50,
    },
    username: {
        fontSize: 15,
        marginBottom: 20,
    },
    profileImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 10,
        resizeMode: 'cover',
    },
    noProfileImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: COLORS.noProfile,
        color: 'white',
        fontSize: 50,
        textAlign: 'center',
        lineHeight: 90, 
    },
    displayName: {
        marginTop: 15,
        fontSize: 22,
    },
    logoutButton: {
        marginTop: 15,
        backgroundColor: 'transparent',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 100,
    },
    logoutText: {
        color: COLORS.logoutText,
    }
});