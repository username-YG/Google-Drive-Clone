import { View, Image, Text } from 'react-native';
import { FilesList } from '../../components/FilesList';
import { styles } from '../../styles/emptyFolder.styles';
import empty_folder from "../../assets/emptyFolderImages/empty_folder_mydrive.png"

function EmptyFolder() {
  return (
    <View style={styles.emptyFolder}>
      <Image style={styles.emptyFolderImage} source={empty_folder} />
      <Text style={styles.emptyFolderText}>This folder is empty and sad</Text>
      <Text style={styles.emptyFolderText}>Upload something so it won't be sad</Text>
    </View>
  )
}

/*
My drive screen shows:
- Files and folders owned by me
- Only files and folders on root level
- Doesn't show items that are in trash
*/
export default function Files() {
    return (
        <View>
            <FilesList
                filter={["OWNS", "NOT TRASHED"]}
                emptyFolder={<EmptyFolder/>}
                title="My Drive"
            ></FilesList>
        </View>
    );
}