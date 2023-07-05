import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";

import * as Haptics from "expo-haptics";
import moment from "moment/moment";

import Button from "../../button/Button";
import styles from "./videoCard.style";

const formatVideoDuration = (durationInSeconds) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const VideoCard = ({ video, onNavigate, selectedVideos, toggleSelect }) => {
  const [selected, setSelected] = useState(false);

  const handleLongPress = () => {
    toggleSelect(video.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handlePress = () => {
    if (selectedVideos.length > 0) {
      toggleSelect(video.id);
    } else {
      onNavigate();
    }
  };

  useEffect(() => {
    if (selectedVideos.includes(video.id)) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [selectedVideos]);

  return (
    <Button
      style={styles.container(selected)}
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={200}
    >
      <View style={styles.contentContainer}>
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: video.uri }} style={styles.thumbnail} />
          <View style={styles.durationContainer}>
            <Text style={styles.durationText}>
              {formatVideoDuration(video.duration)}
            </Text>
          </View>
        </View>
        <View style={styles.videoInfoContainer}>
          <Text numberOfLines={3} ellipsizeMode="tail" style={styles.fileName}>
            {video.filename}
          </Text>
          <Text style={styles.fileDetails}>
            {moment(video.modificationTime).fromNow()}
          </Text>
        </View>
      </View>
    </Button>
  );
};

export default VideoCard;
