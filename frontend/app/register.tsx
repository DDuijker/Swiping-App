import * as React from "react";
import { SafeAreaView, View, Dimensions, Platform, StyleSheet, Alert } from "react-native";
import { Button, Text, Provider, TextInput, MD3Theme, HelperText } from "react-native-paper"; 
import { useTranslation } from "react-i18next";
import { useTheme } from '../context/ThemeContext';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { theme } = useTheme(); // Get the current theme
  const { width } = Dimensions.get("window");
  const isSmallDevice = width < 360;

  // State to manage username, email and password inputs
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [usernameError, setUsernameError] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const styles = createStyles(theme, isSmallDevice);

// Function to handle registration
  const handleRegister = async () => {
    console.log("Register Pressed", { username, email, password })
        // Reset error messages
      setUsernameError('');
      setEmailError('');
      setPasswordError('');

      // Validate inputs before making the request
      if (!username) {
        setUsernameError("Username is required");
        return;
      }
      if (!email) {
        setEmailError("Email is required");
        return;
      }
      if (!password) {
        setPasswordError("Password is required");
        return;
      }
    try {
      const response = await fetch('http://localhost:5001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });
  
      if (response.status === 201) {
        Alert.alert("Success", "User registered successfully");
      } else if (response.status === 400) {
        Alert.alert("Error", "User already exists or missing fields");
      } else {
        Alert.alert("Error", "Failed to register user");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <Provider theme={theme}>
      <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {t("common.register")}
          </Text>
          
          <TextInput
            label="Username" 
            value={username} 
            onChangeText={text => setUsername(text)} 
            style={styles.input} 
            mode="flat" 
            numberOfLines={1} 
            multiline={false}
            error={!!usernameError} 
          />
          <HelperText type="error" visible={!!usernameError}>
            {usernameError}
          </HelperText>
          <TextInput
            label="Email" 
            value={email} 
            onChangeText={text => setEmail(text)} 
            style={styles.input} 
            mode="flat" 
            numberOfLines={1} 
            multiline={false} 
            error={!!emailError}
          />
          <HelperText type="error" visible={!!emailError}>
            {emailError}
          </HelperText>
          <TextInput
            label="Password" 
            value={password}
            onChangeText={text => setPassword(text)} 
            secureTextEntry 
            style={styles.input} 
            mode="flat" 
            numberOfLines={1} 
            multiline={false}
            error={!!passwordError}
          />
          <HelperText type="error" visible={!!passwordError}>
          {passwordError}
          </HelperText>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={{ color: theme.colors.onPrimary }}
            onPress={handleRegister} // Log username, email and password
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
      
      borderTopRightRadius: theme.roundness,
      borderTopLeftRadius: theme.roundness,
    },
    button: {
      width: Platform.OS === "web" ? "50%" : isSmallDevice ? "80%" : "50%",
      marginBottom: 20,
    },
  });
}
