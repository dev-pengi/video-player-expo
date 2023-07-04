import React from "react";
import { TouchableRipple } from "react-native-paper";
import { colors } from "../../../constants";

const Button = ({
  onPress,
  onLongPress,
  delayLongPress = 300,
  children,
  ripples,
  style,
  ...restProps
}) => {
  const handlePress = () => {
    onPress && onPress();
  };
  const handleLongPress = () => {
    onLongPress && onLongPress();
  };

  return (
    <TouchableRipple
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={delayLongPress}
      borderless={true}
      rippleColor={ripples == "strong" ? colors.softStrong : colors.soft}
      activeOpacity={0.4}
      style={style}
      {...restProps}
    >
      {children}
    </TouchableRipple>
  );
};

export default Button;
