// import React, { useEffect, useState } from "react";
// import { View, Image, StyleSheet } from "react-native";
// import { Text, Button, List, Chip } from "react-native-paper";
// import { useTranslation } from "react-i18next";
// import { useTheme } from "../../../context/ThemeContext";
// import { logout, getUser } from "../../../api/userService";
// import { router } from "expo-router";

// export default function ProfileIndex() {
//   const { t } = useTranslation();
//   const { theme } = useTheme();
//   const [user, setUser] = useState(null); // Gebruikersgegevens
//   const [genres, setGenres] = useState([
//     { name: "Actie", selected: false },
//     { name: "Drama", selected: false },
//     { name: "Komedie", selected: false },
//   ]);

//   // Haal gebruikersgegevens op bij het laden van de pagina
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const user = await getUser();
//         if (!user) {
//           router.navigate("/login");
//           return;
//         }
//         setUser(user); // Sla de gebruikersgegevens op
//       } catch (error) {
//         console.error(t("errors.auth.fetchUser"), error);
//       }
//     };
//     fetchUser();
//   }, []);

//   // Log de gebruiker uit
//   const handleLogout = async () => {
//     try {
//       await logout();
//       router.navigate("/login");
//     } catch (error) {
//       console.error(t("errors.auth.logout"), error);
//     }
//   };

//   // Controleer of de gebruikersgegevens beschikbaar zijn
//   if (!user) {
//     return (
//       <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
//         <Text style={styles.text}>Gebruikersgegevens laden...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
//       {/* Profielfoto en naam */}
//       <View style={styles.header}>
//         <Text variant="titleLarge" style={styles.text}>
//           {user.name || user.username || "Gebruiker"} {/* Gebruikersnaam of naam */}
//         </Text>
//         <Text variant="bodyMedium" style={styles.text}>
//           {user.email || "email@example.com"}
//         </Text>
//       </View>

//       {/* Instellingen en beheer */}
//       <List.Section>
//         <List.Item
//           title="Wachtwoord wijzigen"
//           left={(props) => <List.Icon {...props} icon="key" />}
//           onPress={() => console.log("Wachtwoord wijzigen")}
//         />
//         <List.Item
//           title="Privacy instellingen"
//           left={(props) => <List.Icon {...props} icon="lock" />}
//           onPress={() => console.log("Privacy instellingen")}
//         />
//       </List.Section>

//       {/* Voorkeurssectie */}
//       <View style={styles.genreSection}>
//         <Text variant="titleMedium" style={styles.text}>
//           Voorkeurssectie
//         </Text>
//         <View style={styles.chips}>
//           {genres.map((genre) => (
//             <Chip
//               key={genre.name}
//               selected={genre.selected}
//               onPress={() =>
//                 setGenres((prev) =>
//                   prev.map((g) =>
//                     g.name === genre.name ? { ...g, selected: !g.selected } : g
//                   )
//                 )
//               }
//               style={styles.chip}
//             >
//               {genre.name}
//             </Chip>
//           ))}
//         </View>
//       </View>

//       {/* Logout-knop */}
//       <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
//         {t("common.actions.logout") || "Uitloggen"}
//       </Button>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 16,
//   },
//   text: {
//     color: "black",
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   genreSection: {
//     marginVertical: 16,
//   },
//   chips: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   chip: {
//     margin: 4,
//   },
//   logoutButton: {
//     marginTop: 16,
//   },
// });



// export default function ProfileIndex() {
//   const [avatar, setAvatar] = React.useState(null);

//   const handleImagePicker = () => {
//     ImagePicker.launchImageLibrary(
//       { mediaType: "photo" },
//       async (response) => {
//         if (response.didCancel) return; // Gebruiker heeft geannuleerd
//         if (response.errorCode) {
//           Alert.alert("Fout", response.errorMessage);
//           return;
//         }

//         const formData = new FormData();
//         formData.append("avatar", {
//           uri: response.assets[0].uri,
//           type: response.assets[0].type,
//           name: response.assets[0].fileName,
//         });

//         try {
//           const res = await fetch("http://localhost:5001/api/profile/avatar", {
//             method: "POST",
//             body: formData,
//             headers: {
//               "Content-Type": "multipart/form-data",
//               Authorization: `Bearer ${yourAuthToken}`,
//             },
//           });
//           const data = await res.json();
//           if (data.avatar) {
//             setAvatar(data.avatar); // Update de profielfoto
//           } else {
//             Alert.alert("Fout", data.msg || "Er is iets misgegaan");
//           }
//         } catch (error) {
//           console.error(error);
//           Alert.alert("Fout", "Kon de afbeelding niet uploaden");
//         }
//       }
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Image
//         source={{ uri: avatar || "https://via.placeholder.com/100" }}
//         style={styles.avatar}
//       />
//       <Button mode="contained" onPress={handleImagePicker}>
//         Upload Profielfoto
//       </Button>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 16,
//   },
// });











// import React, { useEffect, useState } from "react";
// import { View, Image, StyleSheet, Alert } from "react-native";
// import { Text, Button, List, Chip } from "react-native-paper";
// import * as ImagePicker from "react-native-image-picker";
// import { useTranslation } from "react-i18next";
// import { useTheme } from "../../../context/ThemeContext";
// import { logout, getUser } from "../../../api/userService";
// import { router } from "expo-router";

// export default function ProfileIndex() {
//   const { t } = useTranslation();
//   const { theme } = useTheme();
//   const [user, setUser] = useState(null); // Gebruikersgegevens
//   const [genres, setGenres] = useState([
//     { name: "Actie", selected: false },
//     { name: "Drama", selected: false },
//     { name: "Komedie", selected: false },
//   ]);
//   const [avatar, setAvatar] = useState(null); // Avatar URL

//   // Haal gebruikersgegevens op bij het laden van de pagina
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userData = await getUser();
//         if (!userData) {
//           router.navigate("/login");
//           return;
//         }
//         setUser(userData);
//         setAvatar(userData.avatar || "https://via.placeholder.com/100");
//       } catch (error) {
//         console.error(t("errors.auth.fetchUser"), error);
//       }
//     };
//     fetchUser();
//   }, []);

//   // Log de gebruiker uit
//   const handleLogout = async () => {
//     try {
//       await logout();
//       router.navigate("/login");
//     } catch (error) {
//       console.error(t("errors.auth.logout"), error);
//     }
//   };

//   // Profielfoto uploaden
//   const handleImagePicker = () => {
//     ImagePicker.launchImageLibrary(
//       { mediaType: "photo" },
//       async (response) => {
//         if (response.didCancel) return; // Gebruiker heeft geannuleerd
//         if (response.errorCode) {
//           Alert.alert("Fout", response.errorMessage);
//           return;
//         }

//         const formData = new FormData();
//         formData.append("avatar", {
//           uri: response.assets[0].uri,
//           type: response.assets[0].type,
//           name: response.assets[0].fileName,
//         });

//         try {
//           const res = await fetch("http://localhost:5001/api/profile/avatar", {
//             method: "POST",
//             body: formData,
//             headers: {
//               "Content-Type": "multipart/form-data",
//               Authorization: `Bearer ${yourAuthToken}`, // Zorg dat je de juiste token meestuurt
//             },
//           });
//           const data = await res.json();
//           if (data.avatar) {
//             setAvatar(data.avatar); // Update de profielfoto
//             Alert.alert("Succes", "Profielfoto succesvol geüpload");
//           } else {
//             Alert.alert("Fout", data.msg || "Er is iets misgegaan");
//           }
//         } catch (error) {
//           console.error(error);
//           Alert.alert("Fout", "Kon de afbeelding niet uploaden");
//         }
//       }
//     );
//   };

//   // Controleer of de gebruikersgegevens beschikbaar zijn
//   if (!user) {
//     return (
//       <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
//         <Text style={styles.text}>Gebruikersgegevens laden...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
//       {/* Profielfoto en naam */}
//       <View style={styles.header}>
//         <Image
//           source={{ uri: avatar }}
//           style={styles.avatar}
//         />
//         <Button mode="contained" onPress={handleImagePicker} style={styles.uploadButton}>
//           Upload Profielfoto
//         </Button>
//         <Text variant="titleLarge" style={styles.text}>
//           {user.name || user.username || "Gebruiker"} {/* Gebruikersnaam of naam */}
//         </Text>
//         <Text variant="bodyMedium" style={styles.text}>
//           {user.email || "email@example.com"}
//         </Text>
//       </View>

//       {/* Instellingen en beheer */}
//       <List.Section>
//         <List.Item
//           title="Wachtwoord wijzigen"
//           left={(props) => <List.Icon {...props} icon="key" />}
//           onPress={() => console.log("Wachtwoord wijzigen")}
//         />
//         <List.Item
//           title="Privacy instellingen"
//           left={(props) => <List.Icon {...props} icon="lock" />}
//           onPress={() => console.log("Privacy instellingen")}
//         />
//       </List.Section>

//       {/* Voorkeurssectie */}
//       <View style={styles.genreSection}>
//         <Text variant="titleMedium" style={styles.text}>
//           Voorkeurssectie
//         </Text>
//         <View style={styles.chips}>
//           {genres.map((genre) => (
//             <Chip
//               key={genre.name}
//               selected={genre.selected}
//               onPress={() =>
//                 setGenres((prev) =>
//                   prev.map((g) =>
//                     g.name === genre.name ? { ...g, selected: !g.selected } : g
//                   )
//                 )
//               }
//               style={styles.chip}
//             >
//               {genre.name}
//             </Chip>
//           ))}
//         </View>
//       </View>

//       {/* Logout-knop */}
//       <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
//         {t("common.actions.logout") || "Uitloggen"}
//       </Button>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 16,
//   },
//   uploadButton: {
//     marginBottom: 16,
//   },
//   text: {
//     color: "black",
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   genreSection: {
//     marginVertical: 16,
//   },
//   chips: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   chip: {
//     margin: 4,
//   },
//   logoutButton: {
//     marginTop: 16,
//   },
// });






import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Alert } from "react-native";
import { Text, Button, List, Chip } from "react-native-paper";
import * as ImagePicker from "react-native-image-picker";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../context/ThemeContext";
import { logout, getUser } from "../../../api/userService";
import { router } from "expo-router";

export default function ProfileIndex() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [user, setUser] = useState(null); // Gebruikersgegevens
  const [genres, setGenres] = useState([
    { name: "Actie", selected: false },
    { name: "Drama", selected: false },
    { name: "Komedie", selected: false },
  ]);
  const [avatar, setAvatar] = useState(null); // Avatar URL

  // Haal gebruikersgegevens op bij het laden van de pagina
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        if (!userData) {
          router.navigate("/login");
          return;
        }
        setUser(userData);
        setAvatar(userData.avatar || "https://via.placeholder.com/100");
      } catch (error) {
        console.error(t("errors.auth.fetchUser"), error);
      }
    };
    fetchUser();
  }, []);

  // Log de gebruiker uit
  const handleLogout = async () => {
    try {
      await logout();
      router.navigate("/login");
    } catch (error) {
      console.error(t("errors.auth.logout"), error);
    }
  };

  // Profielfoto uploaden
  const handleImagePicker = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: "photo" },
      async (response) => {
        if (response.didCancel) return; // Gebruiker heeft geannuleerd
        if (response.errorCode) {
          Alert.alert("Fout", response.errorMessage);
          return;
        }

        const formData = new FormData();
        formData.append("avatar", {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName,
        });

        try {
          const res = await fetch("http://localhost:5001/api/profile/avatar", {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${yourAuthToken}`, // Zorg dat je de juiste token meestuurt
            },
          });
          const data = await res.json();
          if (data.avatar) {
            setAvatar(data.avatar); // Update de profielfoto
            Alert.alert("Succes", "Profielfoto succesvol geüpload");
          } else {
            Alert.alert("Fout", data.msg || "Er is iets misgegaan");
          }
        } catch (error) {
          console.error(error);
          Alert.alert("Fout", "Kon de afbeelding niet uploaden");
        }
      }
    );
  };

  // Controleer of de gebruikersgegevens beschikbaar zijn
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={styles.text}>Gebruikersgegevens laden...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Profielfoto en naam */}
      <View style={styles.header}>
        <Image
          source={{ uri: avatar }}
          style={styles.avatar}
        />
        <Button mode="contained" onPress={handleImagePicker} style={styles.uploadButton}>
          Upload Profielfoto
        </Button>
        <Text variant="titleLarge" style={styles.text}>
          {user.name || user.username || "Gebruiker"} {/* Gebruikersnaam of naam */}
        </Text>
        <Text variant="bodyMedium" style={styles.text}>
          {user.email || "email@example.com"}
        </Text>
      </View>

      {/* Instellingen en beheer */}
      <List.Section>
        <List.Item
          title="Wachtwoord wijzigen"
          left={(props) => <List.Icon {...props} icon="key" />}
          onPress={() => router.push("/(tabs)/profile/ChangePassword")}
        />
        <List.Item
          title="E-mailadres wijzigen"
          left={(props) => <List.Icon {...props} icon="email" />}
          onPress={() => router.push("/(tabs)/profile/ChangeEmail")}
        />
          
        <List.Item
          title="Account verwijderen"
          left={(props) => <List.Icon {...props} icon="delete" />}
          onPress={() => router.push("/(tabs)/profile/DeleteAccount")}
        />
      </List.Section>

      {/* Voorkeurssectie */}
      <View style={styles.genreSection}>
        <Text variant="titleMedium" style={styles.text}>
          Voorkeurssectie
        </Text>
        <View style={styles.chips}>
          {genres.map((genre) => (
            <Chip
              key={genre.name}
              selected={genre.selected}
              onPress={() =>
                setGenres((prev) =>
                  prev.map((g) =>
                    g.name === genre.name ? { ...g, selected: !g.selected } : g
                  )
                )
              }
              style={styles.chip}
            >
              {genre.name}
            </Chip>
          ))}
        </View>
      </View>

      {/* Logout-knop */}
      <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
        {t("common.actions.logout") || "Uitloggen"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  uploadButton: {
    marginBottom: 16,
  },
  text: {
    color: "black",
    textAlign: "center",
    marginBottom: 8,
  },
  genreSection: {
    marginVertical: 16,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    margin: 4,
  },
  logoutButton: {
    marginTop: 16,
  },
});
