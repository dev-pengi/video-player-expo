import { StyleSheet } from "react-native";

import { colors, sizes } from "../../../../constants";

const styles = StyleSheet.create({
  btnContainer: {
    height: 55,
    paddingHorizontal: sizes.xSmall / 4,
    flex: 1,
    justifyContent: "center",
  },
  btnContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: sizes.small,
  },
  fileName: {
    fontSize: sizes.medium + 1,
    fontWeight: "thin",
    color: "#c9c9c9",
  },
  fileCount: {
    fontSize: sizes.small + 1.5,
    fontWeight: "normal",
    color: "#898989",
  },
});

export default styles;
