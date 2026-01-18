import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import { COLORS } from '../styles/Theme';
import { styles } from '../styles/_layout.styles';
import { Image } from 'react-native';
import TopBarButton from '../components/TopBarButton';
import Logo from '../components/Logo';

export default function RootLayout() {

  const router = useRouter();

  return (
    <GestureHandlerRootView>
      <Drawer
      initialRouteName="login"
      drawerContent={(props) => <Logo {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: COLORS.hard_selected,
        headerStyle: { backgroundColor: 'transparent' },
        headerShadowVisible: false,
        drawerLabelStyle: styles.navBarLabel
      }}>

        { /* Main app screens (the tabs one doesn't appear in nav bar) */ }
        <Drawer.Screen name="(tabs)" options={{
            title: '',
            drawerItemStyle: { display: 'none' }
        }} />

        <Drawer.Screen name="recent" options={{
            title: 'Recent Files',
            drawerIcon: ({color, size}) => (<Image source={require('../assets/icons/clock.png')} style={styles.navBarImage} />),
            headerLeft: () => <TopBarButton router={router} img={require("../assets/icons/back.png")} target={"/home"} />,
            headerRight: () => <TopBarButton router={router} img={require("../assets/icons/search.png")} target="/home" />
        }} />

        <Drawer.Screen name="trash" options={{
            title: 'Trash',
            drawerIcon: ({color, size}) => (<Image source={require('../assets/icons/trash.png')} style={styles.navBarImage} />),
            headerLeft: () => <TopBarButton router={router} img={require("../assets/icons/back.png")} target="/home" />,
            headerRight: () => <TopBarButton router={router} img={require("../assets/icons/search.png")} target="/home" />
        }} />

        <Drawer.Screen name="uploads" options={{
            drawerIcon: ({color, size}) => (<Image source={require('../assets/icons/upload.png')} style={styles.navBarImage} />),
            title: 'Uploads',
            headerLeft: () => <TopBarButton router={router} img={require("../assets/icons/back.png")} target="/home" />
        }} />

        { /* Rest of the screens (they don't appear in nav bar) */ }
        <Drawer.Screen name="login" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="registration" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />

      </Drawer>
    </GestureHandlerRootView>
  );
}