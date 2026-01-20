import { TouchableOpacity, Text } from "react-native";
import { styles } from '../styles/BackButton.styles.js';

export const BackButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            activeOpacity={0.5}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}