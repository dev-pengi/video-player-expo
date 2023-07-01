import { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Slider, Icon } from "@rneui/themed";
import { Video, ResizeMode } from "expo-av";
import { debounce } from "lodash";

import * as ScreenOrientation from "expo-screen-orientation";
import * as SecureStore from "expo-secure-store";

import Button from "../../common/button/Button";
import { colors } from "../../../constants";
import styles from "./videoPlayer.style";

const VideoPlayer = ({ video, onNavigationBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playPosition, setPlayPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef(null);

  const { width, height } = Dimensions.get("window");
  useEffect(() => {
    const retrievePlaybackPosition = async () => {
      try {
        const storedPosition = await SecureStore.getItemAsync(`playPosition.${video.id}`);
        console.log(storedPosition);
        if (storedPosition !== null) {
          setPlayPosition(parseInt(storedPosition, 10));
        }
      } catch (error) {
        console.log("Error retrieving playback position:", error);
      }
    };

    retrievePlaybackPosition();
  }, [video]);

  useEffect(() => {
    const storePlaybackPosition = async () => {
      try {
        await SecureStore.setItemAsync(`playPosition.${video.id}`, playPosition.toString());
        console.log("Done stored position");
      } catch (error) {
        console.log("Error storing playback position:", error);
      }
    };

    storePlaybackPosition();
  }, [playPosition]);
  useEffect(() => {
    videoRef.current?.presentFullscreenPlayer();
    const enableFullscreen = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };

    enableFullscreen();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);
  function formatVideoDuration(duration) {
    const hours = Math.floor(duration / (60 * 60 * 1000));
    const minutes = Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((duration % (60 * 1000)) / 1000);

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    let formattedDuration = `${formattedMinutes}:${formattedSeconds}`;

    if (hours > 0) {
      formattedDuration = `${formattedHours}:${formattedDuration}`;
    }

    return formattedDuration;
  }
  const debouncedSetPosition = debounce((value) => {
    setPlayPosition(value);
  }, 20);
  const debouncedHnadleSeek = debounce((value) => {
    videoRef.current?.setPositionAsync(value);
  }, 40);
  const handleSeek = async (direction) => {
    const newPosition =
      direction == "forward" ? playPosition + 10000 : playPosition - 10000;
    debouncedHnadleSeek(newPosition);
  };

  useEffect(() => {
    if (isPlaying) {
      if (duration == playPosition) {
        videoRef.current?.replayAsync();
      }
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
    }
  }, [isPlaying]);

  return (
    <View style={styles.container}>
      {video && (
        <Video
          source={{ uri: video.uri }}
          style={styles.video}
          ref={videoRef}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true}
          onLoad={(videoDetails) => {
            setIsLoading(false);
            setDuration(videoDetails.durationMillis);
          }}
          useNativeControls={false}
          progressUpdateIntervalMillis={200}
          onPlaybackStatusUpdate={(newDetails) => {
            debouncedSetPosition(newDetails.positionMillis);
            if (newDetails.didJustFinish) {
              setIsPlaying(false);
            }
          }}
        />
      )}
      <View style={styles.controlsContainer(width, height)}>
        <View style={styles.playerHeader}>
          <Button
            onPress={onNavigationBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name="arrow-back" type="material" color="#ffffff" size={25} />
          </Button>
          <Text style={styles.videoTitleText}>{video?.filename}</Text>
          <View></View>
        </View>
        <View style={styles.centerControls(width)}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.white} />
          ) : (
            <>
              <TouchableOpacity onPress={() => handleSeek("backward")}>
                <Icon
                  name="restore"
                  type="material"
                  color="#ffffff"
                  size={45}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: 50 }}
                onPress={() => {
                  setIsPlaying((oldState) => !oldState);
                }}
              >
                {isPlaying ? (
                  <Icon
                    name="pause"
                    type="material"
                    color="#ffffff"
                    size={60}
                  />
                ) : (
                  <Icon
                    name="play-arrow"
                    type="material"
                    color="#ffffff"
                    size={60}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSeek("forward")}>
                <Icon name="update" type="material" color="#ffffff" size={45} />
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.playerBottom}>
          <View style={styles.seekController}>
            <Text style={styles.seekText}>
              {formatVideoDuration(playPosition)}
            </Text>
            <Slider
              value={playPosition}
              onSlidingStart={(value) => {
                setIsPlaying(false);
                setPlayPosition(value);
              }}
              onValueChange={(value) => {
                debouncedSetPosition(value);
              }}
              onSlidingComplete={(value) => {
                videoRef.current?.setPositionAsync(value);
                setIsPlaying(true);
              }}
              maximumValue={duration}
              minimumValue={0}
              style={styles.seekBar}
              allowTouchTrack
              minimumTrackTintColor="#1d7dde"
              trackStyle={{ height: 5, backgroundColor: "#1d7dde" }}
              thumbStyle={{
                height: 20,
                width: 20,
                backgroundColor: "#1d7dde",
              }}
            />
            <Text style={styles.seekText}>{formatVideoDuration(duration)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default VideoPlayer;
