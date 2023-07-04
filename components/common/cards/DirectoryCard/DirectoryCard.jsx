import { View, Text, Image } from "react-native";
import Button from "../../button/Button";

import { icons } from "../../../../constants";
import styles from "./directoryCard.style";
import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";

const DirectoryCard = ({ album, onNavigate, selectedAlbums, toggleSelect }) => {
  const [selected, setSelected] = useState(false);

  const handleLongPress = () => {
    toggleSelect(album.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handlePress = () => {
    if (selectedAlbums.length > 0) {
      toggleSelect(album.id);
    } else {
      onNavigate();
    }
  };

  useEffect(() => {
    if (selectedAlbums.includes(album.id)) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [selectedAlbums]);

  return (
    <Button
      style={styles.btnContainer(selected)}
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
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
