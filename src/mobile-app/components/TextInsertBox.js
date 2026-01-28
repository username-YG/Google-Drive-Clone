import { Modal, TouchableOpacity, View, Text, TextInput } from 'react-native';
import { styles } from '../styles/TextInsertBox.styles';
import { useState } from 'react';
import { useTheme } from './ThemeContext';

export const TextInsertBox = ({ title, doneTitle, isOpen, setIsOpen, onDone }) => {
    const { theme } = useTheme(); //
    const [text, setText] = useState("");

    return (
        <Modal animationType="fade" transparent={true} visible={isOpen} onRequestClose={() => setIsOpen(false)}>
            <TouchableOpacity style={styles.blackBackground} activeOpacity={1} onPress={() => setIsOpen(false)}>
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>

                    {/* Apply themed background to the popup box */}
                    <View style={[styles.popupBox, { backgroundColor: theme.actionsMenuColor }]}>

                        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

                        <TextInput
                            style={[
                                styles.input,
                                {
                                    color: theme.text,
                                    borderColor: theme.hard_selected,
                                    backgroundColor: 'transparent'
                                }
                            ]}
                            value={text}
                            onChangeText={setText}
                            autoFocus
                            selectTextOnFocus
                            placeholderTextColor={theme.text + '80'}
                            selectionColor={theme.hard_selected} //
                        />

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.button} onPress={() => setIsOpen(false)} >
                                <Text style={[styles.buttonText, { color: theme.hard_selected }]}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={async () => await onDone(text)} >
                                <Text style={[styles.buttonText, { color: theme.hard_selected }]}>{doneTitle}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}