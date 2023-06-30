import { Text, View, SafeAreaView, ActivityIndicator } from "react-native";
import { Stack, useRouter, useSearchParams } from "expo-router";

import { colors, icons, sizes } from "../../constants";

import { useEffect, useRef, useState } from "react";
import { useExplorerContext } from "../../contexts/ExplorerContext";

import { Video, ResizeMode } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";

const VideoPlayer = () => {
  const params = useSearchParams();
  const router = useRouter();

  const [uri, setUri] = useState(null);

  const { videoFiles, isLoading, error } = useExplorerContext();

  useEffect(() => {
    if (videoFiles) {
      const videos = videoFiles.flatMap((album) => album.videos);
      const video = videos.find((video) => video.id === params.id);
      console.log(video);
      console.log(params.id);
      video && setUri(video.uri);
    }
  }, [videoFiles]);

  const videoRef = useRef(null);

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

  return (
    <>
      {uri && (
        <Video
          source={{ uri: uri }} // Replace with the path or URL of your video
          style={{ flex: 1, backgroundColor: "#000" }}
          ref={videoRef}
          resizeMode={ResizeMode.STRETCH}
          shouldPlay
          useNativeControls
        />
      )}
    </>
  );
};

const Player = () => {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <VideoPlayer />
    </>
  );
};

export default Player;
