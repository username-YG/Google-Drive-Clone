import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
  },
  logoImage: {
    width: 75,
    height: 30,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    color: '#202124',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#202124',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
});