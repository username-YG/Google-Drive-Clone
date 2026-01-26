import { TouchableOpacity, Image } from 'react-native';
import { styles } from '../styles/TopBarButton.styles';

export default function TopBarButton({ router, img, target, iconStyle = {} }) {
    return (
        <TouchableOpacity onPress={() => router.push(target)}>
            <Image source={img} style={[styles.topBarButton, iconStyle]} />
        </TouchableOpacity>
    );
}