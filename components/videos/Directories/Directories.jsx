import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import Button from "../../common/button/Button";

import useFetchVideoFiles from "../../../hooks/useFetchVideoFiles";

import styles from "./directories.style";
import { useRouter } from "expo-router";
import { icons } from "../../../constants";
import DirectoryCard from "../../common/cards/DirectoryCard/DirectoryCard";
import { useExplorerContext } from "../../../contexts/ExplorerContext";

const Directories = ({ navigation }) => {
  const router = useRouter();
  const { refreshFiles } = useFetchVideoFiles();
  const { videoFiles, isLoading, error } = useExplorerContext();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshFiles();
    setRefreshing(false);
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
          {videoFiles?.map((album, index) => (
            <DirectoryCard
              key={index}
              album={album}
              onNavigate={() => router.push(`album/${album.id}`)}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
};

export default Directories;
