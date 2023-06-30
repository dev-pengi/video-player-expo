import { useEffect } from "react";
import * as MediaLibrary from "expo-media-library";
import { useExplorerContext } from "../contexts/ExplorerContext";

const useFetchVideoFiles = () => {
  const { setVideoFiles, setIsLoading, setError } = useExplorerContext();

  const fetchVideoFiles = async () => {
    setIsLoading(true);
    try {
      let { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        throw new Error("Permission to access location was denied");
      }
      const albums = await MediaLibrary.getAlbumsAsync();

      const albumsWithVideos = await Promise.all(
        albums.map(async (album) => {
          const { assets } = await MediaLibrary.getAssetsAsync({
            album: album,
            mediaType: MediaLibrary.MediaType.video,
          });

          if (assets.length > 0) {
            return {
              ...album,
              videos: assets,
              newestVideoDate: assets[0].creationTime,
            };
          }
        })
      );
      const sortedAlbums = albumsWithVideos
        .filter((album) => album)
        .sort((a, b) => b.newestVideoDate - a.newestVideoDate);

      // const updatedVideos = [];
      // for (const sortedAlbum of sortedAlbums) {
      //   for (const videoFile of sortedAlbum.videos) {
      //     const { uri } = await VideoThumbnails.getThumbnailAsync(
      //       videoFile.uri,
      //       {
      //         time: 10,
      //       }
      //     );
      //     updatedVideos.push({ ...videoFile, thumbnail: uri });
      //   }
      // }

      setVideoFiles(sortedAlbums);
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoFiles();
  }, []);

  const refreshFiles = () => {
    fetchVideoFiles();
  };

  return { refreshFiles };
};

export default useFetchVideoFiles;
