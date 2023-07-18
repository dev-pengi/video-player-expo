import { useCallback, useEffect, useState } from "react";
import { View, SafeAreaView, Text,Alert  } from "react-native";
import { debounce } from "lodash";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";

import * as FileSystem from "expo-file-system";

import { ScreenHeaderBtn } from "../components";
import { colors, sizes } from "../constants";

import Directories from "../components/videos/Directories/Directories";
import { useExplorerContext } from "../contexts/ExplorerContext";

const Home = () => {
  const { albums, isSelecting, setIsSelecting, refreshFiles } =
    useExplorerContext();
  const [selectedAlbums, setSelectedAlbums] = useState([]);

  const toggleSelect = debounce((album) => {
    setSelectedAlbums((oldState) => {
      if (oldState.map((al) => al.id).includes(album.id)) {
        return oldState.filter((item) => item.id !== album.id);
      } else {
        return [...oldState, album];
      }
    });
  }, 100);

  useEffect(() => {
    if (selectedAlbums.length === 0) {
      setIsSelecting(false);
    } else {
      setIsSelecting(true);
    }
  }, [selectedAlbums]);

  const handleSelectAll = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedAlbums(albums);
  }, [albums]);

  const handleClearSelection = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedAlbums([]);
  }, []);

  const handleDelete = useCallback(() => {
    const albumVideos =
      selectedAlbums.flatMap((album) => album.videos)?.map((vid) => vid.uri) ??
      [];
    console.log(albumVideos);
    const deleteAlbums = async () => {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      if (status) {
        for (const vid of albumVideos) {
          await FileSystem.deleteAsync(vid);
        }
        await refreshFiles();
      } else {
        Alert.alert("Error", "permission for deleting has been denied");
      }
    };
    deleteAlbums();
  }, [selectedAlbums]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.darker }}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: colors.dark,
          },
          headerShadowVisible: true,
          headerLeft: () => (
            <View
              style={{
                gap: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isSelecting ? (
                <>
                  <ScreenHeaderBtn
                    name={"close"}
                    onPress={handleClearSelection}
                  />
                  <Text style={{ color: "#ffffff", fontSize: sizes.large }}>
                    {selectedAlbums.length}
                  </Text>
                </>
              ) : (
                <Text
                  style={{ fontWeight: 600, fontSize: 22, color: colors.white }}
                >
                  Videos
                </Text>
              )}
            </View>
          ),
          headerRight: () => (
            <View style={{ gap: 6, flexDirection: "row" }}>
              {isSelecting ? (
                <>
                  <ScreenHeaderBtn
                    name={"delete"}
                    onPress={() => {
                      Alert.alert(
                        "Delete confirmation",
                        "Are you sure you want to proceed?",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "default",
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
      <Directories
        selectedAlbums={selectedAlbums}
        toggleSelect={toggleSelect}
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

export default Home;
