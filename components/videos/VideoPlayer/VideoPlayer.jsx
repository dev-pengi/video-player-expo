import { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Slider, Icon } from "@rneui/themed";
import { debounce } from "lodash";

import { Video, ResizeMode } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import * as SecureStore from "expo-secure-store";
import * as NavigationBar from "expo-navigation-bar";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

import Button from "../../common/button/Button";
import { sizes } from "../../../constants";
import styles from "./videoPlayer.style";
import { TouchableWithoutFeedback } from "react-native";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import { useExplorerContext } from "../../../contexts/ExplorerContext";

const VideoPlayer = ({ video, albumVideos, onNavigationBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControllers, setShowControllers] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  const [playPosition, setPlayPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const [nextVideoId, setNextVideoId] = useState(null);
  const [previousVideoId, setPreviousVideoId] = useState(null);

  const [resizeMode, setResizeMode] = useState(ResizeMode.CONTAIN);

  const { currentVideo, setCurrentVideo } = useExplorerContext();

  const videoRef = useRef(null);

  const { width, height } = Dimensions.get("window");

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const lockedFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (currentVideo) {
      const currentVideoIndex = albumVideos.findIndex(
        (video) => video.id === currentVideo
      );
      if (currentVideoIndex > 0) {
        setPreviousVideoId(albumVideos[currentVideoIndex - 1].id);
      } else {
        setPreviousVideoId(null);
      }
      if (currentVideoIndex < albumVideos.length - 1) {
        setNextVideoId(albumVideos[currentVideoIndex + 1].id);
      } else {
        setNextVideoId(null);
      }
    }
  }, [currentVideo, albumVideos]);

  const handleSkipNext = () => {
    if (nextVideoId) {
      setCurrentVideo(nextVideoId);
      setIsPlaying(true);
      setIsLoading(true);
    }
  };

  const handleSkipPrevious = () => {
    if (previousVideoId) {
      setCurrentVideo(previousVideoId);
      setIsPlaying(true);
      setIsLoading(true);
    }
  };

  const fadeIn = (ref) => {
    Animated.timing(ref, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const slideDown = (ref) => {
    Animated.timing(ref, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = (ref) => {
    Animated.timing(ref, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (showControllers) {
      if (isLocked) {
        fadeOut(fadeAnim);
        fadeIn(lockedFadeAnim);
      } else {
        fadeIn(fadeAnim);
        fadeOut(lockedFadeAnim);
      }
    } else {
      fadeOut(lockedFadeAnim);
      slideDown(lockedFadeAnim);
      fadeOut(fadeAnim);
    }
  }, [showControllers, isLocked]);

  useEffect(() => {
    if (showControllers && isLocked) fadeIn(lockedFadeAnim);
    else if (!showControllers && isLocked) {
      fadeOut(lockedFadeAnim);
      slideDown(lockedFadeAnim);
    }
  }, [showControllers, isLocked]);

  useEffect(() => {
    videoRef.current?.presentFullscreenPlayer();
    const enableFullscreen = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };
    const activateKeepAwake = async () => {
      await activateKeepAwakeAsync();
    };

    const hideNavigationBar = async () => {
      await NavigationBar.setVisibilityAsync("hidden");
    };
    const unhideNavigationBar = async () => {
      await NavigationBar.setVisibilityAsync("visible");
    };

    enableFullscreen();
    activateKeepAwake();
    hideNavigationBar();

    return () => {
      ScreenOrientation.unlockAsync();
      deactivateKeepAwake();
      unhideNavigationBar();
    };
  }, []);

  const debouncedSetPosition = debounce((value) => {
    setPlayPosition(value);
  }, 20);
  const debouncedHnadleSeek = debounce((value) => {
    videoRef.current?.setPositionAsync(value);
  }, 40);

  const retrievePlaybackPosition = async () => {
    try {
      const storedPosition = await SecureStore.getItemAsync(
        `playPosition.${video.id}`
      );

      if (!storedPosition || parseInt(storedPosition, 10) == duration) return;
      debouncedHnadleSeek(parseInt(storedPosition, 10));
    } catch (error) {
      console.log("Error retrieving playback position:", error);
    }
  };

  useEffect(() => {
    debouncedSetPosition(0);
    retrievePlaybackPosition();
  }, [video]);

  useEffect(() => {
    const storePlaybackPosition = async () => {
      try {
        await SecureStore.setItemAsync(
          `playPosition.${video.id}`,
          playPosition.toString()
        );
      } catch (error) {
        console.log("Error storing playback position:", error);
      }
    };

    storePlaybackPosition();
  }, [playPosition]);
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

  const toggleIsPlaying = () => {
    setIsPlaying((oldState) => !oldState);
  };

  const toggleLock = () => {
    setIsLocked((oldState) => !oldState);
  };
  const toggleControls = () => {
    setShowControllers((oldState) => !oldState);
  };

  const onGestureEvent = (event, callback) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      callback();
    }
  };


  return (
    <PinchGestureHandler
      onGestureEvent={() => console.log("pinch started")}
      onBegan={() => console.log("pinch started")}
      onActivated={() => console.log("pinch started")}
      onEnded={() => console.log("pinch ended")}
    >
      <TouchableWithoutFeedback
        onPress={toggleControls}
        onLongPress={toggleLock}
        delayLongPress={1200}
        style={styles.container}
      >
        <View style={styles.container}>
          {video && (
            <Video
              source={{ uri: video.uri }}
              style={styles.video}
              ref={videoRef}
              resizeMode={resizeMode}
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
          <Animated.View
            style={{
              ...styles.controlsContainer(width, height),
              opacity: fadeAnim,
            }}
            pointerEvents={showControllers && !isLocked ? "auto" : "none"}
          >
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
                <Icon
                  name="arrow-back"
                  type="material"
                  color="#ffffff"
                  size={25}
                />
              </Button>
              <Text style={styles.videoTitleText}>{video?.filename}</Text>
              <View></View>
            </View>
            <View style={styles.centerControls(width)}>
              {isLoading ? (
                <ActivityIndicator size="large" color={"#0096fc"} />
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => handleSeek("backward")}
                    activeOpacity={0.8}
                  >
                    <Icon
                      name="restore"
                      type="material"
                      color="#ffffff"
                      size={45}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ width: 50 }}
                    onPress={toggleIsPlaying}
                    activeOpacity={0.8}
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
                  <TouchableOpacity
                    onPress={() => handleSeek("forward")}
                    activeOpacity={0.8}
                  >
                    <Icon
                      name="update"
                      type="material"
                      color="#ffffff"
                      size={45}
                    />
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
                  minimumTrackTintColor="#0096fc"
                  trackStyle={{ height: 5, backgroundColor: "#1d7dde" }}
                  thumbStyle={{
                    height: 20,
                    width: 20,
                    backgroundColor: "#1d7dde",
                  }}
                />
                <Text style={styles.seekText}>
                  {formatVideoDuration(duration)}
                </Text>
              </View>
              <View style={styles.playerActions}>
                {previousVideoId && (
                  <Button
                    style={{ borderRadius: 5 }}
                    ripples={"strong"}
                    onPress={handleSkipPrevious}
                  >
                    <View style={styles.actionButton}>
                      <Icon
                        name="skip-previous"
                        type="material"
                        color="#ffffff"
                        size={30}
                      />
                      <Text style={styles.actionButtonText}>
                        Previous video
                      </Text>
                    </View>
                  </Button>
                )}
                <Button
                  style={{ borderRadius: 5 }}
                  ripples={"strong"}
                  onPress={() => {
                    setIsLocked(true);
                  }}
                >
                  <View style={styles.actionButton}>
                    <Icon
                      name="lock"
                      type="material"
                      color="#ffffff"
                      size={30}
                    />
                    <Text style={styles.actionButtonText}>Lock</Text>
                  </View>
                </Button>
                {nextVideoId && (
                  <Button
                    style={{ borderRadius: 5 }}
                    ripples={"strong"}
                    onPress={handleSkipNext}
                  >
                    <View style={styles.actionButton}>
                      <Icon
                        name="skip-next"
                        type="material"
                        color="#ffffff"
                        size={30}
                      />
                      <Text style={styles.actionButtonText}>Next video</Text>
                    </View>
                  </Button>
                )}
              </View>
            </View>
          </Animated.View>

          {isLocked && (
            <Animated.View
              style={{
                ...styles.controlsContainer(width, height),
                opacity: lockedFadeAnim,
              }}
              pointerEvents={showControllers && isLocked ? "auto" : "none"}
            >
              <Animated.View
                style={{
                  ...styles.unlockContainer,
                  transform: [{ translateY: lockedFadeAnim }],
                }}
              >
                <Button
                  style={{ borderRadius: 122 }}
                  onPress={() => setIsLocked(false)}
                >
                  <View style={styles.unlockButton}>
                    <Icon
                      name="lock-open"
                      type="material"
                      color="#1a1a1a"
                      size={sizes.xLarge}
                    />
                  </View>
                </Button>
              </Animated.View>
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </PinchGestureHandler>
  );
};

export default VideoPlayer;

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
