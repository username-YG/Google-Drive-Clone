import { StyleSheet } from "react-native";
import { COLORS } from "../styles/Theme";

export const styles = StyleSheet.create({
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  logoImage: {
    width: 30,
    height: 30,
    resizeMode: 'center',
    marginRight: 15
  },
  logoText: {
    fontSize: 20,
    marginBottom: 4,
    opacity: 0.8
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 10,
  },
});
