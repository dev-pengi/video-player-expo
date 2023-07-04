import React from "react";
import { Image } from "react-native";
import { Tooltip } from "react-native-paper";

import styles from "./headerButton.style";
import Button from "../common/button/Button";

const ScreenHeaderBtn = ({ name, iconUrl, dimension, onPress }) => {
  return (
    <Button style={styles.btnContainer} onPress={onPress}>
      <Image
        source={iconUrl}
        resizeMode="cover"
        style={styles.btnImg(dimension)}
      />
    </Button>
  );
};

export default ScreenHeaderBtn;
