import { StatusBar } from "expo-status-bar";
import { View, SafeAreaView, Text } from "react-native";

import { Stack } from "expo-router";
import { ScreenHeaderBtn } from "../components";
import { colors, icons } from "../constants";
import Directories from "../components/videos/Directories/Directories";

const Home = () => {

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.darker }}>
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: colors.dark,
            },
            headerShadowVisible: true,
            headerLeft: () => (
              <Text
                style={{ fontWeight: 600, fontSize: 22, color: colors.white }}
              >
                Videos
              </Text>
            ),
            headerRight: () => (
              <View style={{ gap: 6, flexDirection: "row" }}>
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
        <Directories />
        <StatusBar style="light" />
      </SafeAreaView>
  );
};

export default Home;
