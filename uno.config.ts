// uno.config.ts
import { colors } from "@unocss/preset-wind"
import { defineConfig, presetUno } from "unocss"

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000",
      white: "#fff",
      dark: colors.slate[950], // '#020617'
      darkLight: colors.slate[900],
      darkLightBorder: colors.slate[800],
      grayDark: colors.slate[600],
      gray: colors.slate[400],
      grayLight: colors.slate[300],
      light: colors.slate[200],
      primary: colors.sky[400],
      successDark: colors.emerald[700],
      successLight: colors.emerald[300],
      warningDark: colors.amber[700],
      warningLight: colors.amber[300],
      errorDark: colors.red[700],
      errorLight: colors.red[300],
    },
    fontSize: {
      base: ["16px", "24px"],
      small: ["14px", "20px"],
      micro: ["10px", "12px"],
    },
    fontFamily: {
      sans: "Helvetica Neue, Arial, Tahoma, sans-serif",
    },
  },
})
