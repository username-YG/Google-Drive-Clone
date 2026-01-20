import { TouchableOpacity, Text } from "react-native";
import { styles } from '../styles/NextButton.styles.js';

export const NextButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}