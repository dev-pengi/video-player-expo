import React from "react";
import { Image } from "react-native";
import { Tooltip } from "react-native-paper";

import styles from "./headerButton.style";
import Button from "../common/button/Button";
import { Icon } from "@rneui/themed";

const ScreenHeaderBtn = ({ type = "material", name, size = 25, onPress }) => {
  return (
    <Button style={styles.btnContainer} onPress={onPress}>
      <Icon name={name} type={type} color="#ffffff" size={size} />
    </Button>
  );
};

export default ScreenHeaderBtn;
