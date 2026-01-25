import { Modal } from 'react-native';
import { styles } from '../styles/TextInput.styles';

export const TextInput = ({ isOpen, setIsOpen }) => {

    return (
        <Modal animationType="fade" transparent={true} visible={isOpen} onRequestClose={() => setIsOpen(false)} >
            <TouchableOpacity style={styles.blackBackground} activeOpacity={1} onPress={() => setIsOpen(false)}>
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                    <ActionMenu file={file} close={() => { setIsOpen(false); }} />
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )

}