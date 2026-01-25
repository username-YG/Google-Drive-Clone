import { View, Image, Text } from 'react-native';
import { FilesList } from '../components/FilesList';
import { styles } from '../styles/emptyFolder.styles';
import empty_folder from "../assets/emptyFolderImages/empty_folder_recent.png"

function EmptyFolder() {
  return (
    <View style={styles.emptyFolder}>
      <Image style={styles.emptyFolderImage} source={empty_folder} />
      <Text style={styles.emptyFolderText}>No recent files</Text>
      <Text style={styles.emptyFolderText}>"Time is relative" (Albert Einstein)</Text>
    </View>
  )
}

/*
Recent screen shows:
- Owned or shared files recently accessed
- Doesn't show folders
- Shows files from all levels, not just root level
- Doesn't show files that are in trash
- Recently is defined as 'today' and accessed is defined as created \ patched
*/
export default function Recent() {
    return (
        <View>
            <FilesList
                filter={["NOT TRASHED", "ALL LEVELS", "NOT FOLDER", "RECENT"]}
                emptyFolder={<EmptyFolder/>}
                title="Welcome"
            ></FilesList>
        </View>
    );
}