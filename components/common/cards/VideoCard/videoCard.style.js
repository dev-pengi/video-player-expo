import { StyleSheet } from "react-native";

import { sizes, colors } from "../../../../constants";

const styles = StyleSheet.create({
  container: (selected) => ({
    flex: 1,
    color: colors.white,
    paddingVertical: sizes.xSmall,
    paddingHorizontal: sizes.xSmall,
    backgroundColor: selected ? colors.soft : "transparent",
  }),
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: sizes.small,
  },
  thumbnailContainer: {
    position: "relative",
    width: 100,
    height: 60,
    borderRadius: 5,
    overflow: "hidden",
  },
  durationContainer: {
    position: "absolute",
    bottom: 3,
    right: 3,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: sizes.xSmall / 3,
    borderRadius: 3,
  },
  durationText: {
    fontSize: sizes.xSmall,
    fontWeight: "normal",
    color: colors.white,
  },

  thumbnail: {
    width: 100,
    height: 60,
    borderRadius: 5,
  },
  videoInfoContainer: {
    flexDirection: "column",
    flex: 1,
  },
  fileName: {
    fontSize: sizes.medium / 1.05,
    fontWeight: "thin",
    color: "#c9c9c9",
  },
  fileDetails: {
    fontSize: sizes.small + 1.5,
    fontWeight: "normal",
    color: "#898989",
  },
});

export default styles;
