import { StyleSheet } from "react-native";
import { COLORS } from './Theme';

export const styles = StyleSheet.create({
    bottomBar: {
        height: 100,
        borderTopWidth: 0, 
        elevation: 0,
        backgroundColor: COLORS.bottomBar,
    },
    bottomBarLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    iconBackground: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingVertical: 7,
        paddingHorizontal: 18,
    },
});