import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Image, Text } from 'react-native';
import { styles } from '../styles/Logo.styles';

export default function Logo(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.logo}>
        <Image style={styles.logoImage} source={require("../assets/icons/google.png")} />
        <Text style={styles.logoText}>Drive</Text>
      </View>
      <View style={styles.separator} />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}