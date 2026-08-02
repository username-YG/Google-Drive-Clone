import { Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { styles } from '../styles/CloseSearchBar.styles';
import { useRouter } from 'expo-router';
import { useTheme } from './ThemeContext';

export default function CloseSearchBar() {
  const router = useRouter();
  const { theme } = useTheme();

  // We get the screen width to help the bar calculate its size if flex is struggling
  const screenWidth = Dimensions.get('window').width;

  return (
      <View style={{ width: screenWidth - 130, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
            style={[
              styles.container,
              {
                backgroundColor: theme.closedSearchBar,
                width: '100%',
                height: 48,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 24
              }
            ]}
            onPress={() => router.push('/search')}
        >
          <Text style={[styles.bar, { color: theme.text, paddingHorizontal: 0, textAlign: 'center' }]}>
            Search in files
          </Text>
        </TouchableOpacity>
      </View>
  );
}