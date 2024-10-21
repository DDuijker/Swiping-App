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

  // State to manage username, email and password inputs
  const [username, setUsername] = React.useState('');
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
          
          <TextInput
            label="Username" 
            value={username} 
            onChangeText={text => setUsername(text)} 
            style={styles.input} 
            mode="outlined" 
            numberOfLines={1} 
            multiline={false} 
          />

          <TextInput
            label="Email" 
            value={email} 
            onChangeText={text => setEmail(text)} 
            style={styles.input} 
            mode="outlined" 
            numberOfLines={1} 
            multiline={false} 
          />

          <TextInput
            label="Password" 
            value={password}
            onChangeText={text => setPassword(text)} 
            secureTextEntry 
            style={styles.input} 
            mode="outlined" 
            numberOfLines={1} 
            multiline={false}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={{ color: theme.colors.onPrimary }}
            onPress={() => console.log("Register Pressed", { username, email, password })} // Log username, email and password
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
