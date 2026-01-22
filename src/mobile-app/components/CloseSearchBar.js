import { Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/CloseSearchBar.styles';
import { useRouter } from 'expo-router';

export default function CloseSearchBar() {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.container}
      onPress={() => router.push('/search')}
    >
      <Text style={styles.bar}>Search in Drive</Text>
    </TouchableOpacity>
  );
}