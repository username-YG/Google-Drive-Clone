import { Modal, TouchableOpacity, View, Text, TextInput } from 'react-native';
import { styles } from '../styles/TextInsertBox.styles';
import { useState } from 'react';

export const TextInsertBox = ({ title, doneTitle, isOpen, setIsOpen, onDone }) => {

    const [text, setText] = useState()
    return (
        <Modal animationType="fade" transparent={true} visible={isOpen} onRequestClose={() => setIsOpen(false)}>
            <TouchableOpacity style={styles.blackBackground} activeOpacity={1} onPress={() => setIsOpen(false)}>
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>

                    <View style={styles.popupBox}>
                        
                        <Text style={styles.title}>{title}</Text>
                        
                        <TextInput
                            style={styles.input}
                            value={text}
                            onChangeText={setText}
                            autoFocus
                            selectTextOnFocus
                        />

                        <View style={styles.buttonRow}>

                            <TouchableOpacity style={styles.button} onPress={() => setIsOpen(false)} >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={async () => await onDone(text)} >
                                <Text style={styles.buttonText}>{doneTitle}</Text>
                            </TouchableOpacity>

                        </View>

                    </View>

                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )

}