import { View, Text, Image } from 'react-native';
import { styles } from '../styles/GoogleLogo.styles.js';
import { useTheme } from './ThemeContext';

export const Logo = ({ title, subtitle }) => {
    const { theme } = useTheme();
    return (
        <View style={styles.logo}>
            <Image style={styles.logoImage} source={require("../assets/icons/google.png")} />
            {/* Override style colors with theme colors */}
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>{subtitle}</Text>
        </View>
    );
}