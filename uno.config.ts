// uno.config.ts
import { colors } from "@unocss/preset-wind"
import { defineConfig, presetUno } from "unocss"

export const defaultColors = {
  transparent: "transparent",
  current: "currentColor",
  buttonTextColor: colors.neutral[50],
  shadowNeutral: colors.neutral[300],
  black: colors.neutral[950],
  dark: colors.neutral[900],
  darkNeutral: colors.neutral[900],
  grayDark: colors.neutral[800],
  grayDarkBorder: colors.neutral[700],
  grayContrast: colors.neutral[600],
  darkBorder: "#111",
  gray: colors.neutral[500],
  grayNeutral: colors.neutral[500],
  lightNeutral: colors.neutral[50],
  grayLight: colors.neutral[300],
  graySuperLight: colors.neutral[200],
  lightBorder: colors.neutral[100],
  light: "#f3f3f3",
  white: "#ffffff",

  primaryDarkAlternative: colors.indigo[800],
  primaryDarkNeutral: colors.indigo[700],
  buttonPrimaryDarkBg: colors.indigo[700],
  primarySuperDark: colors.slate[900],
  primaryDark: colors.indigo[700],
  primary: colors.indigo[500],
  primaryLight: colors.indigo[300],
  primarySuperLight: colors.indigo[100],
  primaryLightAlternative: colors.indigo[200],

  secondaryDarkNeutral: colors.cyan[700],
  secondaryDarkAlternative: colors.cyan[800],
  secondarySuperDark: colors.cyan[900],
  secondaryDark: colors.cyan[700],
  secondary: colors.cyan[600],
  secondaryLight: colors.cyan[300],
  secondarySuperLight: colors.cyan[100],
  secondaryLightAlternative: colors.cyan[200],

  successDarkNeutral: colors.emerald[700],
  success: colors.emerald[500],
  successSuperLight: colors.emerald[50],
  successLight: colors.emerald[200],
  successDark: colors.emerald[800],
  successSuperDark: colors.emerald[950],

  warningDarkNeutral: colors.amber[700],
  warning: colors.amber[500],
  warningSuperLight: colors.amber[50],
  warningLight: colors.amber[200],
  warningDark: colors.amber[800],
  warningSuperDark: colors.amber[950],

  errorDarkNeutral: colors.red[700],
  errorSuperLight: colors.red[50],
  errorLight: colors.red[200],
  error: colors.red[500],
  errorDark: colors.red[800],
  errorSuperDark: colors.red[950],
}

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: defaultColors,
    fontSize: {
      base: ["16px", "24px"],
      small: ["14px", "20px"],
      micro: ["10px", "12px"],
    },
    fontFamily: {
      sans: "Helvetica Neue, Arial, Tahoma, sans-serif",
    },
  },
  preflights: [
    {
      // export theme to css variables
      getCSS: ({ theme }) => {
        let cssVariables = ""

        if (theme.colors) {
          for (const color of Object.keys(theme.colors)) {
            if (typeof theme.colors?.[color] === "string") {
              cssVariables += `--color-${color}: ${theme.colors?.[color]};\n`
            }
          }
        }

        if (theme.fontSize) {
          for (const size of Object.keys(theme.fontSize)) {
            if (Array.isArray(theme.fontSize?.[size])) {
              cssVariables += `--font-size-${size}: ${theme.fontSize?.[size][0]};\n`
            }
          }
        }

        return `
          body, html {
            background-color: ${theme.colors?.dark};
            color: ${theme.colors?.light};
            font-family: ${theme.fontFamily?.sans};
            font-size: ${theme.fontSize?.base[0]};
          }
          :root {
            ${cssVariables}
          }
        `
      },
    },
  ],
})
