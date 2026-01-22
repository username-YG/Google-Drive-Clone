import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  input: {
    width: '100%',
    marginBottom: 8,
    marginTop: 3,
  },
  label: {
    paddingHorizontal: 4,
    zIndex: 1,
  },
  inputWrapper: {
    height: 60,
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  textInput: {
    fontSize: 16,
    backgroundColor: 'transparent',
    height: '100%',
    width: '100%',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingLeft: 4,
  },
  errorText: {
    color: '#d93025',
    fontSize: 12,
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});