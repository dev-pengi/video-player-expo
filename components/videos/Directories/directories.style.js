import { StyleSheet } from "react-native";

import { sizes, colors } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: colors.white,
    paddingVertical: sizes.xSmall,
    paddingBottom: 100,
  },
  errorContainer: {
    height: "100%",
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: sizes.medium,
    fontWeight: "bold",
    color: colors.white,
  },
});

export default styles;
