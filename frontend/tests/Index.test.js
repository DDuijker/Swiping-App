import * as React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Index from "../app/index";
import { useTheme } from "../context/ThemeContext";

// Mock ThemeContext and Translation functions
jest.mock("../context/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

jest.mock("react-native-paper", () => {
  const realModule = jest.requireActual("react-native-paper");
  return {
    ...realModule,
    Surface: ({ children }) => <>{children}</>, // Removes elevation animation
    Button: ({ children, onPress, ...props }) => (
      <button onClick={onPress} {...props}>
        {children}
      </button>
    ),
  };
});

describe("Index Screen", () => {
  let toggleThemeMock;

  beforeEach(() => {
    toggleThemeMock = jest.fn();
    useTheme.mockReturnValue({
      isDarkTheme: false,
      theme: {
        colors: {
          surfaceVariant: "#FFFFFF",
          onPrimary: "#000000",
          primary: "#6200ee",
          onSurface: "#000000",
          elevation: { level0: "#FFFFFF" },
          surface: "#F5F5F5",
        },
        fonts: {
          headlineLarge: { fontSize: 24 },
          bodyLarge: { fontSize: 16 },
        },
        roundness: 4,
      },
      toggleTheme: toggleThemeMock,
    });
  });

  it("renders the Appbar with theme toggle and language menu", () => {
    const { getByText, getByTestId } = render(<Index />);

    // Check for the theme toggle button (icon)
    const themeToggleButton = getByTestId("theme-toggle");
    expect(themeToggleButton).toBeTruthy();

    // Check for the language menu button
    const languageMenuButton = getByTestId("language-menu");
    expect(languageMenuButton).toBeTruthy();

    // Check for welcome text
    expect(getByText("common.welcome-to-brandname")).toBeTruthy();
  });

  it("opens the language menu when clicked", () => {
    const { getByTestId, queryByTestId } = render(<Index />);

    // Simulate language menu click to open it
    const languageMenuButton = getByTestId("language-menu");
    fireEvent.press(languageMenuButton);

    // Verify if menu items are visible
    expect(queryByTestId("language-item-english")).toBeTruthy();
    expect(queryByTestId("language-item-dutch")).toBeTruthy();
  });

  it("calls toggleTheme when the theme button is pressed", () => {
    const { getByTestId } = render(<Index />);

    // Find the theme toggle button and click it
    const themeToggleButton = getByTestId("theme-toggle");
    fireEvent.press(themeToggleButton);

    // Assert that toggleTheme was called
    expect(toggleThemeMock).toHaveBeenCalled();
  });
});
