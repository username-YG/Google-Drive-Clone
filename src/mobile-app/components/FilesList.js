import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/FilesList.styles.js';

import txt from "../assets/mimetypes/txt.png"
import docs from "../assets/mimetypes/docs.png"
import notype from "../assets/mimetypes/notype.png"
import image from "../assets/mimetypes/image.png"
import pdf from "../assets/mimetypes/pdf.png"
import folder from "../assets/mimetypes/folder.png"

import dots from "../assets/icons/dots.png"
import star from "../assets/icons/selected/star.png"
import people from "../assets/icons/selected/people.png"

const icons = {
  "txt": txt,
  "docs": docs,
  "docx": docs,
  "notype": notype,
  "jpg": image,
  "jpeg": image,
  "png": image,
  "pdf": pdf
}

const ExtraFileData = ({}) => {
    <View style={styles.extraData}>
        <Image source={star} style={styles.smallIcon} resizeMode="contain"></Image>
        <Image source={people} style={styles.smallIcon} resizeMode="contain"></Image>
        <Text style={styles.extraText}>Last accessed</Text>
    </View>
}

const FileListItem = ({ filename }) => {
    return (
        <TouchableOpacity style={styles.box}>
            <View style={styles.iconBox}>
                <Image source={txt} style={styles.fileIcon} resizeMode="contain"></Image>
            </View>
            <View style={styles.textList}>
                <Text style={styles.fileName} numberOfLines={1}>{filename}</Text>
                <ExtraFileData></ExtraFileData>
            </View>
            <Image source={dots} style={styles.sideIcon} resizeMode="contain"></Image>
        </TouchableOpacity>
    )
}

export const FilesList = ({ title }) => {

    const filename = "New file";

    return (
        <ScrollView>
            <Text>{title}</Text>
            <FileListItem filename={filename}></FileListItem>
        </ScrollView>
    );
}