import { forwardRef, useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { styles } from '../styles/Input.styles.js';
import { MaterialIcons } from '@expo/vector-icons';

export const Input = forwardRef(({ placeholder, value, onChangeText, secureTextEntry=false, error='' }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const getLabelColor = () => {
        if (error && (isFocused || value)) return '#d93025';
        
        if (isFocused) return '#1a73e8';
       
        return '#5f6368';
    };

    return (
        <View style={styles.input}>
            <TextInput
                ref={ref}
                mode="outlined"
                label={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                outlineColor={error ? '#d93025' : '#dadce0'}
                activeOutlineColor={error ? '#d93025' : '#1a73e8'}
                errorOutlineColor="#d93025"
                style={styles.textInput}
                theme={{
                    colors: {
                        onSurfaceVariant: getLabelColor(),
                        onSurface: '#202124',
                        error: '#d93025',
                    }
                }}
            />

            {!!error && (
                <View style={styles.errorRow}>
                    <MaterialIcons name="error" size={16} color='#d93025' />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );
});