import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    flex: {
        flex: 1,
        paddingHorizontal: 24,
    },
    upperContent: {
        flex: 1,
        paddingTop: 40,
    },
    input: {
        marginTop: 24,
        gap: 0,
    },
    footerRow: {
        marginTop: 'auto',
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        marginTop: -4,
    },
    checkboxText: {
        marginLeft: 12,
        fontSize: 14,
    },
    uploadWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    dashedCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    imageFill: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    errorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        paddingLeft: 6,
    },
    errorText: {
        color: '#d93025',
        fontSize: 15,
        marginLeft: 5,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    },
});