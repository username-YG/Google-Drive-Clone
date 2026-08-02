import { TextInput, View } from 'react-native';
import { styles } from '../styles/OpenSearchBar.styles';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from './ThemeContext';

export default function OpenSearchBar() {

    const [query, setQuery] = useState("");
    const ref = useRef(null);
    const router = useRouter();
    const { theme } = useTheme();

    // Perform search 300ms after user finished inserting query
    const searchQuery = () => {
        router.replace({ pathname: '/search', params: { q: query }});
    };

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
        <View style={{ flex: 1 }}>
            <TextInput
                placeholder="Search in files"
                placeholderTextColor={theme.text + '80'}
                value={query}
                ref={ref}
                autoFocus={true}
                style={[styles.textInput, { color: theme.text, backgroundColor: 'transparent' }]}
                onChangeText={setQuery}
                returnKeyType="search"
                onSubmitEditing={() => ref.current?.blur()}
                selectionColor={theme.hard_selected}
            />
        </View>
    );
}