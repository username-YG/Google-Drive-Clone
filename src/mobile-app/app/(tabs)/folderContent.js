import { View, Image, Text } from 'react-native';
import { FilesList } from '../../components/FilesList';
import { styles } from '../../styles/emptyFolder.styles';
import empty_folder from "../../assets/emptyFolderImages/empty_folder_home.png"
import { useLocalSearchParams } from 'expo-router';

function EmptyFolder() {
  return (
    <View style={styles.emptyFolder}>
      <Image style={styles.emptyFolderImage} source={empty_folder} />
      <Text style={styles.emptyFolderText}>This folder is empty</Text>
    </View>
  )
}

/*
This screen shows the contents of a clicked folder
*/
export default function FolderContent() {
  const { folderName, folderId } = useLocalSearchParams();
    return (
        <View>
            <FilesList
                folderId={folderId}
                filter={["NOT TRASHED", "ALL LEVELS"]}
                emptyFolder={<EmptyFolder/>}
                title={folderName}
            ></FilesList>
        </View>
    );
}