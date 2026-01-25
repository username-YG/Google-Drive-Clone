import { View, Image, Text } from 'react-native';
import { FilesList } from '../components/FilesList';
import { styles } from '../styles/emptyFolder.styles';
import empty_folder from "../assets/emptyFolderImages/empty_folder_trash.png"

function EmptyFolder() {
  return (
    <View style={styles.emptyFolder}>
      <Image style={styles.emptyFolderImage} source={empty_folder} />
      <Text style={styles.emptyFolderText}>Trash is empty</Text>
      <Text style={styles.emptyFolderText}>Press 'delete' key to remove</Text>
    </View>
  )
}

/*
Trash screen shows:
- Trashed files and folders
- Because of trashing logic, it shared items
- Items from all levels, not just root level
*/
export default function Trash() {
    return (
        <View>
            <FilesList
                filter={["TRASHED", "ALL LEVELS"]}
                emptyFolder={<EmptyFolder/>}
                title="Trash"
            ></FilesList>
        </View>
    );
}