import { TouchableOpacity, Image } from 'react-native';
import { styles } from '../styles/TopBarButton.styles';

export default function TopBarButton({ router, img, target }) {
    return (
        <TouchableOpacity onPress={() => router.navigate(target)}>
            <Image source={img} style={styles.topBarButton} />
        </TouchableOpacity>
    );
}