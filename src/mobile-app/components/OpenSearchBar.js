import { TextInput, View } from 'react-native';
import { styles } from '../styles/OpenSearchBar.styles';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function OpenSearchBar() {

  const [query, setQuery] = useState("")
  const ref = useRef(null);
  const router = useRouter();

  // Perform search 300ms after user finished inserting query
  const searchQuery = () => { router.replace({ pathname: '/search', params: { q: query }}) }
  useEffect(() => {
    const timeout = setTimeout(searchQuery, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  // Auto focus on text input
  useFocusEffect(
    useCallback(() => {
      setQuery("");
      const timer = setTimeout(() => ref.current?.focus(), 100);
      return () => clearTimeout(timer);
    }, [])
  );

  return (
    <View>
      <TextInput
          placeholder="Search in Drive"
          value={query}
          ref={ref}
          autoFocus={true}
          style={styles.textInput}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={() => ref.current?.blur()}
      />
    </View>
  );
}