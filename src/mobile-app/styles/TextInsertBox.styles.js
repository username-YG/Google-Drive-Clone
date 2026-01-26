import { StyleSheet } from "react-native";
import { COLORS } from "../styles/Theme.js"

export const styles = StyleSheet.create({
    blackBackground: {
        flex: 1,
        backgroundColor: '#00000055',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupBox: {
        width: 300,
        padding: 24,
        borderRadius: 28,
        backgroundColor: COLORS.actionsMenuColor,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'left',
    },
    input: {
        width: '100%',
        height: 56,
        borderWidth: 2,
        borderColor: COLORS.hard_selected,
        borderRadius: 4,
        paddingHorizontal: 16,
        fontSize: 18,
        marginBottom: 18,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.hard_selected,
    },
});