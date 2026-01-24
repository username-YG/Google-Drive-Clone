import { Tabs } from 'expo-router';
import { View, Image } from 'react-native';
import { styles } from '../../styles/tabs._layout.styles';
import { COLORS } from '../../styles/Theme';

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

function styleIcon({ focused, color, size, route }) {
    if (!ICONS[route.name]) return null;
    return (
        <View style={[ styles.iconBackground, { backgroundColor: focused ? (COLORS.light_selected) : (COLORS.bottomBar) }]}>
            <Image
                source={focused ? (ICONS[route.name].selected) : (ICONS[route.name].default)}
                style={{ width: size, height: size, tintColor: color }}
            />
        </View>
    )
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "black",
                tabBarStyle: styles.bottomBar,
                tabBarLabelStyle: styles.bottomBarLabel,
                tabBarIcon: ({focused, color, size}) => styleIcon({focused, color, size, route}),
                tabBarLabel: ICONS[route.name]?.label
            })}
        >
            <Tabs.Screen name="home" />
            <Tabs.Screen name="starred" />
            <Tabs.Screen name="shared" />
            <Tabs.Screen name="files" />
            <Tabs.Screen name="folderContent" options={{ href: null }} />
        </Tabs>
    );
}