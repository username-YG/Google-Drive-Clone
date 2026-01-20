import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
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
    footer: {
        paddingVertical: 20,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    footerRow: {
        marginTop: 'auto',
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputAndCheckbox: {
        gap: 1,
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
        color: '#202124',
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
        borderColor: '#dadce0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#f8f9fa',
    },
    imageFill: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});