import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import { COLORS } from '../styles/Theme';
import { styles } from '../styles/_layout.styles';
import { Image } from 'react-native';
import TopBarButton from '../components/TopBarButton';
import Logo from '../components/Logo';
import CloseSearchBar from '../components/CloseSearchBar';
import OpenSearchBar from '../components/OpenSearchBar';
import ProfileButton from '../components/ProfileButton';

export default function RootLayout() {

  const router = useRouter();
  return (
    <GestureHandlerRootView>
      <Drawer
        initialRouteName="(tabs)"
        drawerContent={(props) => <Logo {...props} />}
        screenOptions={{
          headerShown: true,
          drawerActiveTintColor: COLORS.hard_selected,
          headerStyle: { backgroundColor: COLORS.topBar },
          headerShadowVisible: false,
          drawerLabelStyle: styles.navBarLabel
        }}
      >

        { /* Main app screens (all except 'tabs' appear in sidebar) */ }
        <Drawer.Screen name="(tabs)" options={{
          headerTitle: () => <CloseSearchBar />,
          headerTitleContainerStyle: { width: '100%' },
          headerTitleAlign: 'left',
          headerRight: () => <ProfileButton router={router} />,
          drawerItemStyle: { display: 'none' }
        }} />

        <Drawer.Screen name="recent" options={{
          title: 'Recent Files',
          drawerIcon: () => (<Image source={require('../assets/icons/clock.png')} style={styles.navBarImage} />),
          headerLeft: () => <TopBarButton router={router} img={require("../assets/icons/back.png")} target={"/home"} />,
          headerRight: () => <TopBarButton router={router} img={require("../assets/icons/search.png")} target="/search" />
        }} />

        <Drawer.Screen name="trash" options={{
          title: 'Trash',
          drawerIcon: () => (<Image source={require('../assets/icons/trash.png')} style={styles.navBarImage} />),
          headerLeft: () => <TopBarButton router={router} img={require("../assets/icons/back.png")} target="/home" />,
          headerRight: () => <TopBarButton router={router} img={require("../assets/icons/search.png")} target="/search" />
        }} />

        <Drawer.Screen name="uploads" options={{
          title: 'Uploads',
          drawerIcon: () => (<Image source={require('../assets/icons/upload.png')} style={styles.navBarImage} />),
          headerLeft: () => <TopBarButton router={router} img={require("../assets/icons/back.png")} target="/home" />
        }} />

        { /* Rest of the screens (they don't appear in nav bar) */ }
        <Drawer.Screen name="login" options={{
          headerShown: false,
          swipeEnabled: false,
          drawerItemStyle: { display: 'none' }
        }} />
        <Drawer.Screen name="registration" options={{
          headerShown: false,
          swipeEnabled: false,
          drawerItemStyle: { display: 'none' }
        }} />
        <Drawer.Screen name="manage_account" options={{
          headerShown: false,
          swipeEnabled: false,
          drawerItemStyle: { display: 'none' } }}
        />

        <Drawer.Screen name="search" options={{
          headerTitle: () => <OpenSearchBar />,
          headerTitleContainerStyle: { width: '100%' },
          headerTitleAlign: 'left',
          headerLeft: () => <TopBarButton router={router} img={require("../assets/icons/back.png")} target="/home" />,
          swipeEnabled: false,
          drawerItemStyle: { display: 'none' }
        }} />

        <Drawer.Screen name="file_viewer" options={{
          headerShown: false,
          swipeEnabled: false,
          drawerItemStyle: { display: 'none' }
        }} />

      </Drawer>
    </GestureHandlerRootView>
  );
}