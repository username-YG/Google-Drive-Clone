import { StyleSheet } from "react-native";
import { COLORS } from "./Theme";

export const styles = StyleSheet.create({
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 45,
    resizeMode: 'cover',
    marginRight: 15
  },
  noProfileImage: {
    width: 45,
    height: 45,
    borderRadius: 45,
    backgroundColor: COLORS.noProfile,
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
    lineHeight: 45,
    marginRight: 15
  },
});