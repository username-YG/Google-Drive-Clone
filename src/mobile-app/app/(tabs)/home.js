import { View, Image, Text } from 'react-native';
import { FilesList } from '../../components/FilesList';
import { styles } from '../../styles/emptyFolder.styles';
import empty_folder from "../../assets/emptyFolderImages/empty_folder_home.png"

function EmptyFolder() {
  return (
    <View style={styles.emptyFolder}>
      <Image style={styles.emptyFolderImage} source={empty_folder} />
      <Text style={styles.emptyFolderText}>Welcome to google drive!</Text>
      <Text style={styles.emptyFolderText}>This screen shows all your personal and shared files</Text>
    </View>
  )
}

/*
The home screen shows:
- Files and folders owned by me
- Files and folders shared with me
- Files from all levels, not just root
- Doesn't show items that are in trash 
*/
export default function Home() {
    return (
        <View>
            <FilesList
                filter={["NOT TRASHED", "ALL LEVELS"]}
                emptyFolder={<EmptyFolder/>}
                title="Welcome"
            ></FilesList>
        </View>
    );
}