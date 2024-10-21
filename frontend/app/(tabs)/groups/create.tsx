import { useTheme } from "../../../context/ThemeContext";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Appbar, Button, PaperProvider, TextInput } from "react-native-paper";
import { SPACING } from "../../../constants/DesignValues";
import { useState } from "react";

export default function CreateGroup() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const router = useRouter();

    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');

    // temporary logic for creating a group
    const handleCreateGroup = () => {
        console.log(`Group Name: ${groupName}, Description: ${description}`);
        router.push('/groups');
    };

    return (
        <SafeAreaView>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Appbar.Header mode="center-aligned">
                    <Appbar.BackAction onPress={() => router.back()} />
                    <Appbar.Content title={t('groups.create')} color={theme.colors.onBackground} />
                </Appbar.Header>

                <View style={styles.content}>
                    <TextInput
                        mode="outlined"
                        label={t("groups.name")}
                        value={groupName}
                        onChangeText={setGroupName}
                        style={styles.input}
                        theme={{ colors: { text: theme.colors.onSurface } }}
                    />
                    <TextInput
                        mode="outlined"
                        label={t("groups.description")}
                        value={description}
                        onChangeText={setDescription}
                        style={styles.input}
                        theme={{ colors: { text: theme.colors.onSurface } }}
                    />

                    <Button
                        mode="contained"
                        onPress={handleCreateGroup}
                        style={styles.button}
                    >
                        {t("common.save")}
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        marginBottom: SPACING.medium,
    },
    button: {
        marginTop: SPACING.large,
    },
});
