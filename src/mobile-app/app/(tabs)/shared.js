import { View, Image, Text } from 'react-native';
import { FilesList } from '../../components/FilesList';
import { styles } from '../../styles/emptyFolder.styles';
import empty_folder from "../../assets/emptyFolderImages/empty_folder_shared.png"

function EmptyFolder() {
  return (
    <View style={styles.emptyFolder}>
      <Image style={styles.emptyFolderImage} source={empty_folder} />
      <Text style={styles.emptyFolderText}>You have no shared items</Text>
      <Text style={styles.emptyFolderText}>Call a friend and ask them to share an item with you</Text>
    </View>
  )
}

/*
Shared screen shows:
- Files and folders shared with me
- Items from all levels, not just root level
- Doesn't show items that are in trash 
*/
export default function Shared() {
    return (
        <View>
            <FilesList
                filter={["SHARES", "NOT TRASHED", "ALL LEVELS"]}
                emptyFolder={<EmptyFolder/>}
                title="Shared with me"
            ></FilesList>
        </View>
    );
}