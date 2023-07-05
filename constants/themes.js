const colors = {
  dark: "#292c33",
  darker: "#22252e",
  white: "#d9d9d9",

  soft: "rgba(255, 255, 255, .09)",
  softStrong: "rgba(255, 255, 255, .49)",
};

const font = {
  regular: "DMRegular",
  medium: "DMMedium",
  bold: "DMBold",
};

const sizes = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const shadow = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export { colors, font, sizes, shadow };
