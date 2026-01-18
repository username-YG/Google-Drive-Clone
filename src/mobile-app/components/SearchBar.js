import { View, TextInput } from 'react-native';
import { styles } from '../styles/SearchBar.styles';

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search in Drive"
        placeholderTextColor="black"
        opacity={0.7}
        style={styles.input}
      />
    </View>
  );
}