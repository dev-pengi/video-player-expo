import { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";

import { Stack, useRouter, useSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";

import { debounce } from "lodash";

import { ScreenHeaderBtn, VideoCard } from "../../components";
import { useExplorerContext } from "../../contexts/ExplorerContext";

import { colors, sizes } from "../../constants";

const Album = () => {
  const params = useSearchParams();
  const router = useRouter();

  const {
    albums,
    isLoading,
    isSelecting,
    setIsSelecting,
    setCurrentVideo,
    refreshFiles,
  } = useExplorerContext();

  const [currentAlbum, setCurrentAlbum] = useState(null);

  const [videos, setVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    const handleRefrsh = async () => {
      setRefreshing(true);
      await refreshFiles();
      setRefreshing(false);
    };
    handleRefrsh();
  }, []);

  const toggleSelect = debounce((id) => {
    setSelectedVideos((oldState) => {
      if (oldState.includes(id)) {
        return oldState.filter((item) => item !== id);
      } else {
        return [...oldState, id];
      }
    });
  }, 100);

  useEffect(() => {
    if (selectedVideos.length === 0) {
      setIsSelecting(false);
    } else {
      setIsSelecting(true);
    }
  }, [selectedVideos]);

  const handleSelectAll = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedVideos(() => {
      return videos.map((vid) => vid.id);
    });
  }, [videos]);

  const handleClearSelection = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedVideos([]);
  }, []);

  const handleDelete = useCallback(() => {
    const deleteVideos = async () => {
      await MediaLibrary.deleteAssetsAsync(selectedVideos);
      await refreshFiles();
    };
    deleteVideos();
  }, [selectedVideos]);

  useEffect(() => {
    if (albums) {
      const album = albums.find((album) => album.id === params.id);
      setCurrentAlbum(album);
      setVideos(album.videos);
    }
  }, [albums]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.darker }}>
      <Stack.Screen
        options={{
          animation: "fade_from_bottom",
          animationDuration: 200,
          headerStyle: {
            backgroundColor: colors.dark,
          },
          headerBackVisible: false,
          headerLeft: () => (
            <>
              {isSelecting ? (
                <View
                  style={{
                    gap: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ScreenHeaderBtn
                    name={"close"}
                    onPress={handleClearSelection}
                  />
                  <Text style={{ color: "#ffffff", fontSize: sizes.large }}>
                    {selectedVideos.length}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 15,
                  }}
                >
                  <ScreenHeaderBtn
                    name={"arrow-back"}
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
              )}
            </>
          ),
          headerRight: () => (
            <View style={{ gap: 6, flexDirection: "row" }}>
              {isSelecting ? (
                <>
                  <ScreenHeaderBtn
                    name={"delete"}
                    onPress={() => {
                      Alert.alert(
                        "Confirmation",
                        "Are you sure you want to proceed?",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Confirm",
                            style: "destructive",
                            onPress: handleDelete,
                          },
                        ],
                        { cancelable: true }
                      );
                    }}
                  />
                  <ScreenHeaderBtn
                    name={"playlist-add-check"}
                    onPress={handleSelectAll}
                  />
                </>
              ) : (
                <></>
              )}
            </View>
          ),
          headerTitle: "",
        }}
      />
      <ScrollView
        style={{ paddingTop: sizes.xSmall }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          videos?.map((video, index) => (
            <VideoCard
              video={video}
              key={index}
              onNavigate={() => {
                setCurrentVideo(video.id);
                router.push(`player`);
              }}
              selectedVideos={selectedVideos}
              toggleSelect={toggleSelect}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Album;
