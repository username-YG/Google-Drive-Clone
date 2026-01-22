import { forwardRef, useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Animated, Pressable } from 'react-native';
import { styles } from '../styles/Input.styles.js';
import { MaterialIcons } from '@expo/vector-icons';

export const Input = forwardRef(({ placeholder, value, onChangeText, secureTextEntry=false, error='' }, ref) => {
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
        if (isFocused) return error ? '#d93025' : '#1a73e8';
        if (error && value) return '#d93025';
        return '#5f6368';
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
        backgroundColor: '#fff',
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
                        borderColor: error ? '#d93025' : (isFocused ? '#1a73e8' : '#dadce0'),
                        borderWidth: isFocused || error ? 2 : 1
                    }
                ]}>
                    <TextInput
                        ref={ref}
                        style={styles.textInput}
                        value={value}
                        onChangeText={onChangeText}
                        secureTextEntry={secureTextEntry}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        selectionColor="#1a73e8"
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