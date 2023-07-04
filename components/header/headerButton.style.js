import { StyleSheet } from "react-native";

import { colors, sizes } from "../../constants";

const styles = StyleSheet.create({
  btnContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  btnImg: (dimension) => ({
    width: dimension,
    height: dimension,
    borderRadius: sizes.small / 1.25,
  }),
});

export default styles;
