import { forwardRef, useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Animated, Pressable } from 'react-native';
import { styles } from '../styles/Input.styles.js';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

export const Input = forwardRef(({ placeholder, value, onChangeText, secureTextEntry=false, error='' }, ref) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(labelAnimation, {
            toValue: (isFocused || value) ? 1 : 0,
            duration: 150,
            useNativeDriver: false,
        }).start();
    }, [isFocused, value]);

    const getLabelColor = () => {
        if (isFocused) return error ? '#d93025' : theme.hard_selected; // Use themed blue
        if (error && value) return '#d93025';
        return theme.text + '90'; // Use muted themed text color
    }

    const labelStyle = {
        position: 'absolute',
        left: 12,
        top: labelAnimation.interpolate({
            inputRange: [0,1],
            outputRange: [18, -10]
        }),
        fontSize: labelAnimation.interpolate({
            inputRange: [0,1],
            outputRange: [16,12],
        }),
        color: getLabelColor(),
        backgroundColor: theme.background,
        paddingHorizontal: 4,
    };

    return (
        <View style={styles.input}>
            <Pressable onPress={() => ref.current?.focus() }>
                <Animated.Text style={[styles.label, labelStyle]} pointerEvents="none">
                    {placeholder}
                </Animated.Text>
                <View style={[
                    styles.inputWrapper,
                    {
                        // Use themed colors for borders
                        borderColor: error ? '#d93025' : (isFocused ? theme.hard_selected : theme.border),
                        borderWidth: isFocused || error ? 2 : 1
                    }
                ]}>
                    <TextInput
                        ref={ref}
                        style={[styles.textInput, { color: theme.text }]}
                        value={value}
                        onChangeText={onChangeText}
                        secureTextEntry={secureTextEntry}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        selectionColor={theme.hard_selected}
                    />
                </View>
            </Pressable>

            {!!error && (
                <View style={styles.errorRow}>
                    <MaterialIcons name="error" size={16} color='#d93025' />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );
});