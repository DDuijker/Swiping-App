import * as React from "react";
import { SafeAreaView, View, Dimensions, Platform, StyleSheet } from "react-native";
import { Button, Text, Provider, TextInput, MD3Theme } from "react-native-paper"; 
import { useTranslation } from "react-i18next";
import { useTheme } from '../context/ThemeContext';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { theme } = useTheme(); // Get the current theme
  const { width } = Dimensions.get("window");
  const isSmallDevice = width < 360;

  // State to manage email and password inputs
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const styles = createStyles(theme, isSmallDevice);

  return (
    <Provider theme={theme}>
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {t("common.register")}
          </Text>
          
          {/* Added TextInput for Email */}
          <TextInput
            label="Email" // Email input label
            value={email} // Bind state value
            onChangeText={text => setEmail(text)} // Update state on change
            style={styles.input} // Custom style for input
            mode="outlined" // Outlined input style
            numberOfLines={1} // Limit to one line
            multiline={false} // Disable multiline
          />

          {/* Added TextInput for Password */}
          <TextInput
            label="Password" // Password input label
            value={password} // Bind state value
            onChangeText={text => setPassword(text)} // Update state on change
            secureTextEntry // Hide password input
            style={styles.input} // Custom style for input
            mode="outlined" // Outlined input style
            numberOfLines={1} // Limit to one line
            multiline={false} // Disable multiline
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={{ color: theme.colors.onPrimary }}
            onPress={() => console.log("Register Pressed", { email, password })} // Log email and password
          >
            {t("common.register")}
          </Button>
        </View>
      </SafeAreaView>
    </Provider>
  );
}

// Function to create styles
function createStyles(theme: MD3Theme, isSmallDevice: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceVariant, 
    },
    title: {
      padding: 20,
      textAlign: "center",
      fontSize: theme.fonts.headlineLarge.fontSize,
      fontWeight: "bold",
      color: theme.colors.onSurface,
    },
    formContainer: {
      width: '80%', 
      alignItems: 'center', 
    },
    input: {
      width: "100%", 
      height: 50,
      marginBottom: 20, 
    },
    buttonContainer: {
      alignItems: 'center',
      width: "80%",
      marginTop: 20,
      marginBottom: 500,
      paddingTop: 20,
      backgroundColor: theme.colors.surface, 
      borderTopRightRadius: theme.roundness,
      borderTopLeftRadius: theme.roundness,
    },
    button: {
      width: Platform.OS === "web" ? "30%" : isSmallDevice ? "80%" : "50%",
      marginBottom: 20,
    },
  });
}
