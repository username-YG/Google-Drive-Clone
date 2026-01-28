import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import { styles } from '../styles/_layout.styles';
import { Image } from 'react-native';
import TopBarButton from '../components/TopBarButton';
import Logo from '../components/Logo';
import CloseSearchBar from '../components/CloseSearchBar';
import OpenSearchBar from '../components/OpenSearchBar';
import ProfileButton from '../components/ProfileButton';
import { ThemeProvider, useTheme } from '../components/ThemeContext';

function DrawerLayout() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
            initialRouteName="(tabs)"
            drawerContent={(props) => <Logo {...props} />}
            screenOptions={{
              headerShown: true,
              headerStyle: {
                backgroundColor: theme.background,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTintColor: theme.text,
              drawerActiveTintColor: theme.hard_selected,
              drawerStyle: { backgroundColor: theme.background },
              headerShadowVisible: false,
              drawerLabelStyle: [styles.navBarLabel, { color: theme.text }],
              sceneContainerStyle: { backgroundColor: theme.background }
            }}
        >

          { /* Main app screens (all except 'tabs' appear in sidebar) */ }
          <Drawer.Screen name="(tabs)" options={{
            headerTitle: () => <CloseSearchBar />,
            headerRight: () => <ProfileButton router={router} />,
            drawerItemStyle: { display: 'none' }
          }} />

          <Drawer.Screen name="recent" options={{
            title: 'Recent Files',
            drawerIcon: () => (<Image source={require('../assets/icons/clock.png')} style={[styles.navBarImage, { tintColor: theme.text }]} />),
            headerLeft: () => <TopBarButton router={router} img={require("../assets/icons/back.png")} target={"/home"} iconStyle={{ tintColor: theme.text }} />,
            headerRight: () => <TopBarButton router={router} img={require("../assets/icons/search.png")} target="/search" iconStyle={{ tintColor: theme.text }} />
          }} />

          <Drawer.Screen name="trash" options={{
            title: 'Trash',
            drawerIcon: () => (<Image source={require('../assets/icons/trash.png')} style={[styles.navBarImage, { tintColor: theme.text }]} />),
            headerLeft: () => <TopBarButton router={router} img={require("../assets/icons/back.png")} target="/home" iconStyle={{ tintColor: theme.text }} />,
            headerRight: () => <TopBarButton router={router} img={require("../assets/icons/search.png")} target="/search" iconStyle={{ tintColor: theme.text }} />
          }} />

          <Drawer.Screen name="uploads" options={{
            title: 'Uploads',
            drawerIcon: () => (<Image source={require('../assets/icons/upload.png')} style={[styles.navBarImage, { tintColor: theme.text }]} />),
            headerLeft: () => <TopBarButton router={router} img={require("../assets/icons/back.png")} target="/home" iconStyle={{ tintColor: theme.text }} />
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
            headerStyle: { backgroundColor: theme.background },
            headerLeft: () => <TopBarButton router={router} img={require("../assets/icons/back.png")} target="/home" iconStyle={{ tintColor: theme.text }} />,
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

export default function RootLayout() {
  return (
      <ThemeProvider>
        <DrawerLayout />
      </ThemeProvider>
  );
}