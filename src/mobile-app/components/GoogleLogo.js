import { View, Text, Image } from 'react-native';
import { styles } from '../styles/GoogleLogo.styles.js';

export const Logo = ({ title, subtitle }) => {
    return (
        <View style={styles.logo}>
            <Image
                style={styles.logoImage} 
                source={require("../assets/icons/google.png")} 
            />

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}