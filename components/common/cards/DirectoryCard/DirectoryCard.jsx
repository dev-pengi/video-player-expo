import { View, Text, Image } from "react-native";
import Button from "../../button/Button";

import { icons } from "../../../../constants";
import styles from "./directoryCard.style";

const DirectoryCard = ({ album, onNavigate }) => {
  return (
    <Button style={styles.btnContainer} onPress={onNavigate}>
      <View style={styles.btnContent}>
        <Image source={icons.folder} />
        <View>
          <Text style={styles.fileName}>{album.title}</Text>
          <Text style={styles.fileCount}>{album.videos.length} videos</Text>
        </View>
      </View>
    </Button>
  );
};

export default DirectoryCard;
