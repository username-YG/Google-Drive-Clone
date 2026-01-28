import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute', 
        bottom: 90,
        right: 10,
        zIndex: 99,
        pointerEvents: 'box-none',
        marginBottom: 20
    },
    backdrop: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: -500,
        top: -1000,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    menuWrapper: {
        position: 'absolute',
        bottom: 30,
        right: 10,
        alignItems: 'flex-end',
        zIndex: 2
    },
    menuItem: {
        position: 'absolute',
        right: 0,
        backgroundColor: '#D3E3FD',
        borderRadius: 16,
        width: 140,
        elevation: 4,
        overflow: 'hidden',
    },
    itemText: {
        fontWeight: '600',
        color: '#041E49'
    },
    itemIcon: {
        width: 20,
        height: 20, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemButton: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-start', 
        paddingVertical: 7,
        paddingHorizontal: 16,
        width: '100%',
        gap: 8,
    },
    openMenu: {
        width: 60,
        height: 60,
        backgroundColor: '#D3E3FD', 
        borderRadius: 16,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    openText: {
        fontSize: 30,
        color: '#041E49'
    },
    closeMenu: {
        position: 'absolute',
        width: 56,
        height: 56,
        backgroundColor: '#0B57D0', 
        borderRadius: 28,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeText: {
        fontSize: 24,
        color: '#FFF'
    },
    fullClick: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});