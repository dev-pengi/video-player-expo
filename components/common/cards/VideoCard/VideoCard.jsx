import { View, Text, Image } from "react-native";
import Button from "../../button/Button";
import moment from "moment/moment";

import styles from "./videoCard.style";

const formatVideoDuration = (durationInSeconds) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const VideoCard = ({ video, onNavigate }) => {
  return (
    <Button style={styles.container} onPress={onNavigate}>
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
            {moment(video.creationTime).fromNow()}
          </Text>
        </View>
      </View>
    </Button>
  );
};

export default VideoCard;
