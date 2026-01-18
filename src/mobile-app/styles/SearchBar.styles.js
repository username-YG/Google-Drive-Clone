import { StyleSheet } from "react-native";
import { COLORS } from './Theme';

export const styles = StyleSheet.create({
  container: {
    height: 55,
    backgroundColor: COLORS.searchBar,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    fontSize: 18,
    padding: 5,
    paddingHorizontal: 60,
    color: '#1F1F1F',
    width: '100%',
    textAlign: 'center',
  },
});