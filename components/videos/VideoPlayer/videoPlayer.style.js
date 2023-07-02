import { StyleSheet } from "react-native";

import { sizes, colors } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "#000",
    flex: 1,
  },
  video: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  controlsContainer: (screenWidth, screenHeight) => ({
    position: "absolute",
    width: screenWidth,
    height: screenHeight,
    left: 0,
    top: 0,
  }),
  playerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 3,
    top: 10,
  },
  videoTitleText: {
    color: "#ffffff",
    fontSize: sizes.medium,
    fontWeight: "semibold",
  },
  centerControls: (screenWidth) => ({
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
    gap: screenWidth / 4.5,
  }),
  playerBottom: {
    marginBottom: 20,
  },
  seekController: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 20,
  },
  seekBar: {
    flex: 1,
    borderRadius: 5,
    bottom: 0,
  },
  seekText: {
    color: "#ffffff",
    fontSize: sizes.medium,
    fontWeight: "semibold",
    textAlign: "center",
  },
});

export default styles;