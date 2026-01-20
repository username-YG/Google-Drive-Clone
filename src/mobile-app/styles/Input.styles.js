import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  input: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  textInput: {
    fontSize: 16,
    backgroundColor: '#fff',
    height: 56,
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