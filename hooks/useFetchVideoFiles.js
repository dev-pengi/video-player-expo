import { useEffect } from "react";
import * as MediaLibrary from "expo-media-library";
import { useExplorerContext } from "../contexts/ExplorerContext";

const useFetchVideoFiles = () => {
  const { setVideoFiles, setIsLoading, setError, setRefreshFiles } =
    useExplorerContext();

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
  // setRefreshFiles(refreshFiles);

  return { refreshFiles };
};

export default useFetchVideoFiles;
