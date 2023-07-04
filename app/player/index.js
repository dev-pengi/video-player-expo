import { Stack, useRouter, useSearchParams } from "expo-router";

import { useEffect, useState } from "react";
import { useExplorerContext } from "../../contexts/ExplorerContext";

import { VideoPlayer } from "../../components";
import { StatusBar } from "expo-status-bar";

const Player = () => {
  const router = useRouter();
  const [video, setVideo] = useState(null);
  const [albumVideos, setAlbumVideos] = useState([]);

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
      const albumVideos = videos.filter((v) => v.albumId === video.albumId);

      video && setVideo(video);
      if (albumVideos) {
        console.log(albumVideos);
        setAlbumVideos(albumVideos);
      } else {
        console.log("No album videos");
      }
      if (!video) {
        router.back();
      }
    }
  }, [videoFiles, currentVideo]);

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
        albumVideos={albumVideos}
        onNavigationBack={() => {
          router.back();
        }}
      />
      <StatusBar hidden={true} />
    </>
  );
};

export default Player;
