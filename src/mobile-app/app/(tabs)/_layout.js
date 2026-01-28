import { Tabs } from 'expo-router';
import { View, Image } from 'react-native';
import { styles } from '../../styles/tabs._layout.styles';
import { useTheme } from '../../components/ThemeContext';
import PlusBtn from '../../components/PlusButton.js';

const baseUrl = "../../assets/icons/"
const ICONS = {
    home: {
        default: require(baseUrl + "home.png"),
        selected: require(baseUrl + "selected/home.png"),
        label: 'Home'
    },
    starred: {
        default: require(baseUrl + "star.png"),
        selected: require(baseUrl + "selected/star.png"),
        label: 'Starred'
    },
    shared: {
        default: require(baseUrl + "people.png"),
        selected: require(baseUrl + "selected/people.png"),
        label: 'Shared'
    },
    files: {
        default: require(baseUrl + "files.png"),
        selected: require(baseUrl + "selected/files.png"),
        label: 'Files'
    },
};

// Pass theme as a parameter to the helper function
function styleIcon({ focused, color, size, route, theme }) {
    if (!ICONS[route.name]) return null;
    return (
        <View style={[
            styles.iconBackground,
            { backgroundColor: focused ? theme.light_selected : 'transparent' }
        ]}>
            <Image
                source={focused ? ICONS[route.name].selected : ICONS[route.name].default}
                style={{ width: size, height: size, tintColor: color }}
            />
        </View>
    )
}

export default function TabsLayout() {
    const { theme } = useTheme(); // Access the active theme

    return (
        <>
            <PlusBtn/>
            <Tabs
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: theme.text,
                    tabBarInactiveTintColor: theme.text + '80',
                    tabBarStyle: [styles.bottomBar, { backgroundColor: theme.bottomBar, borderTopWidth: 0 }],
                    tabBarLabelStyle: styles.bottomBarLabel,
                    tabBarIcon: ({focused, color, size}) => styleIcon({focused, color, size, route, theme}),
                    tabBarLabel: ICONS[route.name]?.label,
                    sceneContainerStyle: { backgroundColor: theme.background }
                })}
            >
                <Tabs.Screen name="home" />
                <Tabs.Screen name="starred" />
                <Tabs.Screen name="shared" />
                <Tabs.Screen name="files" />
                <Tabs.Screen name="folderContent" options={{ href: null }} />
            </Tabs>
        </>
    );
}