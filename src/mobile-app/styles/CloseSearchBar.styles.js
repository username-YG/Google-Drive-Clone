import { StyleSheet } from "react-native";
import { COLORS } from './Theme';

export const styles = StyleSheet.create({
  container: {
    height: 55,
    backgroundColor: COLORS.closedSearchBar,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 25,
  },
  bar: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.7,
  },
});