import { Stack, useRouter, useSearchParams } from "expo-router";

import { useEffect, useState } from "react";
import { useExplorerContext } from "../../contexts/ExplorerContext";

import { VideoPlayer } from "../../components";
import { StatusBar } from "expo-status-bar";

const Player = () => {
  const router = useRouter();
  const [video, setVideo] = useState(null);

  const { videoFiles, currentVideo } = useExplorerContext();
  useEffect(() => {
    if (!currentVideo) {
      router.back();
    }
  }, [currentVideo]);
  useEffect(() => {
    if (videoFiles) {
      const videos = videoFiles.flatMap((album) => album.videos);
      const video = videos.find((video) => video.id === currentVideo);
      video && setVideo(video);

      if (!video) {
        router.back();
      }
    }
  }, [videoFiles]);

  return (
    <>
      <Stack.Screen
        options={{
          animation: "slide_from_bottom",
          headerShown: false,
        }}
      />
      <VideoPlayer
        video={video}
        onNavigationBack={() => {
          router.back();
        }}
      />
      <StatusBar hidden={true} />
    </>
  );
};

export default Player;
