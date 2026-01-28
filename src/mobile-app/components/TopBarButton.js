import { TouchableOpacity, Image } from 'react-native';
import { styles } from '../styles/TopBarButton.styles';
import { useTheme } from './ThemeContext';

export default function TopBarButton({ router, img, target, iconStyle = {} }) {
    const { theme } = useTheme();

    return (
        <TouchableOpacity onPress={() => router.push(target)}>
            {/* Apply theme.text as a tintColor to ensure icons are visible in dark mode */}
            <Image
                source={img}
                style={[
                    styles.topBarButton,
                    { tintColor: theme.text },
                    iconStyle
                ]}
            />
        </TouchableOpacity>
    );
}