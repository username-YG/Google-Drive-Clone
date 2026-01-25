import { StyleSheet } from 'react-native';
import { COLORS } from '../styles/Theme.js'

export const styles = StyleSheet.create({
  blackBackground: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  window: {
    width: 300,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.actionsMenuColor,
    borderRadius: 28,
    padding: 24,
    marginVertical: 90,
  },
  title: {
    marginTop: 0,
    marginBottom: 16,
    fontSize: 24,
  },
  foldersList: {
    flexGrow: 0,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 13,
    borderRadius: 4,
  },
  listItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  icon: {
    width: 20,
    height: 20,
    opacity: 0.8,
    resizeMode: 'contain',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.hard_selected,
  },
});