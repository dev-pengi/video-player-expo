import { useEffect, useState } from "react";
import { View, SafeAreaView, Text } from "react-native";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";

import { ScreenHeaderBtn } from "../components";
import { colors, icons, sizes } from "../constants";
import Directories from "../components/videos/Directories/Directories";
import { debounce } from "lodash";
import { useExplorerContext } from "../contexts/ExplorerContext";

const Home = () => {
  const { videoFiles, isSelecting, setIsSelecting } = useExplorerContext();
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

  const handleSelectAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedAlbums((oldState) => {
      return videoFiles.map((album) => album.id);
    });
  };

  const handleClearSelection = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedAlbums([]);
  };

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
                  <Text style={{ color: '#ffffff', fontSize: sizes.large }}>
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
                  <ScreenHeaderBtn name={"delete"} onPress={handleSelectAll} />
                  <ScreenHeaderBtn
                    name={"playlist-add-check"}
                    onPress={handleSelectAll}
                  />
                </>
              ) : (
                <></>
              )}

              {/* <ScreenHeaderBtn
                  name={"search"}
                  iconUrl={icons.search}
                  dimension="50%"
                />
                <ScreenHeaderBtn
                  name={"menu"}
                  iconUrl={icons.menu}
                  dimension="50%"
                /> */}
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
