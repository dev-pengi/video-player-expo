import React, { createContext, useState, useContext } from "react";

export const ExplorerContext = createContext();

export const ExplorerContextProvider = ({ children }) => {
  const [videoFiles, setVideoFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <ExplorerContext.Provider
      value={{
        videoFiles,
        setVideoFiles,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </ExplorerContext.Provider>
  );
};

export const useExplorerContext = () => {
  return useContext(ExplorerContext);
};
