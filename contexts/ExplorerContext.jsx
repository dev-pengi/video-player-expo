import React, { createContext, useState, useContext, useEffect } from "react";
import * as MediaLibrary from "expo-media-library";

export const ExplorerContext = createContext();

export const ExplorerContextProvider = ({ children }) => {
  const [albums, setAlbums] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresher, setRefresher] = useState(() => () => {});
  const [isSelecting, setIsSelecting] = useState(false);

  const fetchVideoFiles = async () => {
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
              newestVideoDate: assets[0].modificationTime,
            };
          }
        })
      );
      const sortedAlbums = albumsWithVideos
        .filter((album) => album)
        .sort((a, b) => b.newestVideoDate - a.newestVideoDate);

      setAlbums(sortedAlbums);
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

  const refreshFiles = async () => {
    await fetchVideoFiles();
  };

  return (
    <ExplorerContext.Provider
      value={{
        albums,
        setAlbums,
        isLoading,
        setIsLoading,
        error,
        setError,
        refresher,
        setRefresher,
        currentVideo,
        setCurrentVideo,
        isSelecting,
        setIsSelecting,
        refreshFiles,
      }}
    >
      {children}
    </ExplorerContext.Provider>
  );
};

export const useExplorerContext = () => {
  return useContext(ExplorerContext);
};
