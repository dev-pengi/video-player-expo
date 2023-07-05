import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

import { debounce } from "lodash";

import { useExplorerContext } from "../../../contexts/ExplorerContext";

import DirectoryCard from "../../common/cards/DirectoryCard/DirectoryCard";

import styles from "./directories.style";

const Directories = ({ navigation, selectedAlbums, toggleSelect }) => {
  const router = useRouter();
  const { albums, isLoading, error, refreshFiles } = useExplorerContext();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    const handleRefrsh = async () => {
      setRefreshing(true);
      await refreshFiles();
      setRefreshing(false);
    };
    handleRefrsh();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {isLoading ? (
        <ActivityIndicator size="small" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      ) : (
        <>
          {albums?.map((album, index) => (
            <DirectoryCard
              key={index}
              album={album}
              selectedAlbums={selectedAlbums}
              toggleSelect={toggleSelect}
              onNavigate={() => router.push(`album/${album.id}`)}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
};

export default Directories;
