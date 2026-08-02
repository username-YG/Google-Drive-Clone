import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { styles as logoStyles } from '../styles/Logo.styles';
import { styles as layoutStyles } from '../styles/_layout.styles';
import { useTheme } from './ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

export default function Logo(props) {
    const { isDark, toggleTheme, theme } = useTheme();

    return (
        <DrawerContentScrollView {...props} style={{ backgroundColor: theme.background }}>
            {/* Google Drive Logo Header */}
            <View style={logoStyles.logo}>
                <Image style={logoStyles.logoImage} source={require("../assets/icons/google.png")} />
                <Text style={[logoStyles.logoText, { color: theme.text }]}>Storage</Text>
            </View>
            <View style={[logoStyles.separator, { backgroundColor: theme.border }]} />

            {/* Default Sidebar Navigation Items (Recent, Trash, etc.) */}
            <DrawerItemList {...props} />

            {/* Themed Dark Mode Toggle Button */}
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 20,
                    paddingHorizontal: 18,
                }}
                onPress={toggleTheme}
                activeOpacity={0.7}
            >
                {/* Icon matching the size of navBarImage */}
                <MaterialIcons
                    name={isDark ? "light-mode" : "dark-mode"}
                    size={18}
                    color={theme.text}
                    style={{ marginRight: 20 }}
                />

                {/* Text matching the navBarLabel font and size */}
                <Text style={[
                    layoutStyles.navBarLabel,
                    { color: theme.text, marginLeft: 0, fontWeight: 500 }
                ]}>
                    {isDark ? "Light Mode" : "Dark Mode"}
                </Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
}