import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const Colors = {
  light: {
    text: MD3LightTheme.colors.onSurface,
    background: MD3LightTheme.colors.background,
    tint: MD3LightTheme.colors.primary,
    icon: MD3LightTheme.colors.onSurfaceVariant,
    tabIconDefault: MD3LightTheme.colors.onSurfaceVariant,
    tabIconSelected: MD3LightTheme.colors.primary,
  },
  dark: {
    text: MD3DarkTheme.colors.onSurface,
    background: MD3DarkTheme.colors.background,
    tint: MD3DarkTheme.colors.primary,
    icon: MD3DarkTheme.colors.onSurfaceVariant,
    tabIconDefault: MD3DarkTheme.colors.onSurfaceVariant,
    tabIconSelected: MD3DarkTheme.colors.primary,
  },
};
