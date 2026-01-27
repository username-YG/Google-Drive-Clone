import { View, Image, Text } from 'react-native';
import { FilesList } from '../components/FilesList';
import { styles } from '../styles/emptyFolder.styles';
import empty_folder from "../assets/emptyFolderImages/empty_folder_mydrive.png"

function EmptyFolder() {
  return (
    <View style={styles.emptyFolder}>
      <Image style={styles.emptyFolderImage} source={empty_folder} />
      <Text style={styles.emptyFolderText}>No uploads</Text>
      <Text style={styles.emptyFolderText}>Click the plus button and upload!</Text>
    </View>
  )
}

/*
Uploads screen shows:
- Files you uploaded
- Doesn't show files that are in trash
- Items from all levels, not just root level
*/
export default function Uploads() {
    return (
        <View>
            <FilesList
                filter={["NOT TRASHED", "ALL LEVELS", "NOT FOLDER"]}
                emptyFolder={<EmptyFolder/>}
                title="Uploads"
            ></FilesList>
        </View>
    );
}