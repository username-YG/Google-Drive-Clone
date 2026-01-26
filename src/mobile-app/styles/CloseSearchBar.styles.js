import { StyleSheet } from "react-native";
import { COLORS } from './Theme';

export const styles = StyleSheet.create({
  container: {
    height: 55,
    backgroundColor: COLORS.closedSearchBar,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bar: {
    fontSize: 18,
    padding: 5,
    paddingHorizontal: 50,
    textAlign: 'center',
    opacity: 0.7
  },
});