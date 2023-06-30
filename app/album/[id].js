import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Stack, useRouter, useSearchParams } from "expo-router";

import { colors, icons, sizes } from "../../constants";

import { useCallback, useEffect, useState } from "react";
import { ScreenHeaderBtn } from "../../components";
import useFetchVideoFiles from "../../hooks/useFetchVideoFiles";
import { useExplorerContext } from "../../contexts/ExplorerContext";

import VideoCard from "../../components/common/cards/VideoCard/VideoCard";

const Album = () => {
  const params = useSearchParams();
  const router = useRouter();

  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [videos, setVideos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { refreshFiles } = useFetchVideoFiles();
  const { videoFiles, isLoading, error } = useExplorerContext();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshFiles();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (videoFiles) {
      const album = videoFiles.find((album) => album.id === params.id);
      setCurrentAlbum(album);
      setVideos(album.videos);
    }
  }, [videoFiles]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.darker }}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: colors.dark,
          },
          headerBackVisible: false,
          headerLeft: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
            >
              <ScreenHeaderBtn
                iconUrl={icons.left}
                dimension="60%"
                onPress={() => router.back()}
              />
              <Text
                style={{
                  fontSize: sizes.large,
                  fontWeight: "bold",
                  color: colors.white,
                }}
              >
                {currentAlbum?.title}
              </Text>
            </View>
          ),
          headerTitle: "",
        }}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ paddingTop: sizes.xSmall }}
      >
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          videos?.map((video, index) => (
            <VideoCard
              video={video}
              key={index}
              onNavigate={() => router.push(`player/${video.id}`)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Album;
