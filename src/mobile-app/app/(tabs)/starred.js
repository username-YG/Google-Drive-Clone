import { View, Image, Text } from 'react-native';
import { FilesList } from '../../components/FilesList';
import { styles } from '../../styles/emptyFolder.styles';
import empty_folder from "../../assets/emptyFolderImages/empty_folder_starred.png"

function EmptyFolder() {
  return (
    <View style={styles.emptyFolder}>
      <Image style={styles.emptyFolderImage} source={empty_folder} />
      <Text style={styles.emptyFolderText}>No starred files</Text>
      <Text style={styles.emptyFolderText}>Twinkle twinkle little star</Text>
    </View>
  )
}

/*
Starred screen shows:
- Starred files and folders
- Items from all levels, not just root level
- Doesn't show items that are in trash 
*/
export default function Starred() {
    return (
        <View>
            <FilesList
                filter={["STARRED", "NOT TRASHED", "ALL LEVELS"]}
                emptyFolder={<EmptyFolder/>}
                title="Starred"
            ></FilesList>
        </View>
    );
}