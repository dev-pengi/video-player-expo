import { Stack, useRouter, useSearchParams } from "expo-router";

import { useEffect, useState } from "react";
import { useExplorerContext } from "../../contexts/ExplorerContext";

import { VideoPlayer } from "../../components";
import { StatusBar } from "expo-status-bar";

const Player = () => {
  const router = useRouter();
  const [video, setVideo] = useState(null);
  const [albumVideos, setAlbumVideos] = useState([]);

  const { albums, currentVideo } = useExplorerContext();
  useEffect(() => {
    if (!currentVideo) {
      router.back();
    }
  }, [currentVideo]);

  useEffect(() => {
    if (albums) {
      const videos = albums.flatMap((album) => album.videos);
      const video = videos.find((video) => video.id === currentVideo);
      const albumVideos = videos.filter((v) => v.albumId === video.albumId);

      video && setVideo(video);
      if (albumVideos) {
        setAlbumVideos(albumVideos);
      } else {
      }
      if (!video) {
        router.back();
      }
    }
  }, [albums, currentVideo]);

  return (
    <>
      <Stack.Screen
        options={{
          gestureEnabled: false,
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
