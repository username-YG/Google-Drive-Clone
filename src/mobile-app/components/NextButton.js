import { TouchableOpacity, Text } from "react-native";
import { styles } from '../styles/NextButton.styles.js';
import { useTheme } from './ThemeContext';

export const NextButton = ({ title, onPress }) => {
    const { theme } = useTheme();
    const buttonBgColor = '#0b57d0';
    return (
        <TouchableOpacity
            // Apply themed background color to the button
            style={[styles.button, { backgroundColor: buttonBgColor }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}