import { useCallback, useEffect, useState } from "react";
import { View, SafeAreaView, Text } from "react-native";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";

import { ScreenHeaderBtn } from "../components";
import { colors, sizes } from "../constants";
import Directories from "../components/videos/Directories/Directories";
import { debounce } from "lodash";
import { useExplorerContext } from "../contexts/ExplorerContext";
import { Alert } from "react-native";

const Home = () => {
  const { albums, isSelecting, setIsSelecting, refreshFiles } =
    useExplorerContext();
  const [selectedAlbums, setSelectedAlbums] = useState([]);

  const toggleSelect = debounce((id) => {
    setSelectedAlbums((oldState) => {
      if (oldState.includes(id)) {
        return oldState.filter((item) => item !== id);
      } else {
        return [...oldState, id];
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
    setSelectedAlbums(albums.map((al) => al.id));
  }, [albums]);

  const handleClearSelection = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedAlbums([]);
  }, []);

  const handleDelete = useCallback(() => {
    console.log(selectedAlbums);
    const deleteAlbums = async () => {
      await MediaLibrary.deleteAlbumsAsync(selectedAlbums, true);
      await refreshFiles();
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
      <Directories
        selectedAlbums={selectedAlbums}
        toggleSelect={toggleSelect}
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

export default Home;
