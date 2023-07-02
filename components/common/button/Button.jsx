import React from "react";
import { TouchableOpacity, View, Platform } from "react-native";
import { TouchableRipple } from "react-native-paper";

const Button = ({ onPress, children, ripples, style, ...restProps }) => {
  const handlePress = () => {
    onPress && onPress();
  };

  // const TouchableWrapper =
  //   Platform.OS === "android" ? TouchableRipple : TouchableOpacity;

  return (
    <TouchableRipple
      onPress={handlePress}
      borderless={true}
      rippleColor={
        ripples == "strong"
          ? "rgba(255, 255, 255, .49)"
          : "rgba(255, 255, 255, .09)"
      }
      activeOpacity={0.4}
      style={style}
      {...restProps}
    >
      {children}
    </TouchableRipple>
  );
};

export default Button;
