import { TextInput } from 'react-native';
import { styles } from '../styles/OpenSearchBar.styles';
import { useRef } from 'react';

export default function OpenSearchBar() {
  const ref = useRef(null);
  return (
    <TextInput
        placeholder="Search in Drive"
        autoFocus={true}
        ref={ref}
        onBlur={() => ref.current?.focus()}
        style={styles.textInput}
    />
  );
}