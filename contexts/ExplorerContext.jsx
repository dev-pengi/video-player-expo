import React, { createContext, useState, useContext } from "react";

export const ExplorerContext = createContext();

export const ExplorerContextProvider = ({ children }) => {
  const [videoFiles, setVideoFiles] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshFiles, setRefreshFiles] = useState(() => {});

  return (
    <ExplorerContext.Provider
      value={{
        videoFiles,
        setVideoFiles,
        isLoading,
        setIsLoading,
        error,
        setError,
        refreshFiles,
        setRefreshFiles,
        currentVideo,
        setCurrentVideo,
      }}
    >
      {children}
    </ExplorerContext.Provider>
  );
};

export const useExplorerContext = () => {
  return useContext(ExplorerContext);
};
