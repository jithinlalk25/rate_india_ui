import { Slot } from "expo-router";
import { SessionProvider } from "../ctx";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import axios from "axios";
import { useEffect, useState } from "react";
import { Constant } from "../constants";
import {
  ActivityIndicator,
  Button,
  Linking,
  Platform,
  Text,
  View,
} from "react-native";

export default function Root() {
  const [showUpdateScreen, setShowUpdateScreen] = useState(null);
  const [updateUrl, setUpdateUrl] = useState("");

  const getConfig = async () => {
    try {
      const response = await axios.get(`${Constant.API_URL}config/getConfig`);
      if (Platform.OS == "ios") {
        if (response.data.MIN_APP_VERSION.ios > Constant.APP_VERSION) {
          setUpdateUrl(response.data.APP_URL.appstore);
          setShowUpdateScreen(true);
        } else {
          setShowUpdateScreen(false);
        }
      } else {
        if (response.data.MIN_APP_VERSION.android > Constant.APP_VERSION) {
          setUpdateUrl(response.data.APP_URL.playstore);
          setShowUpdateScreen(true);
        } else {
          setShowUpdateScreen(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getConfig();
  }, []);

  if (showUpdateScreen == null) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (showUpdateScreen == true) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: "darkgreen",
            marginBottom: 10,
          }}
        >
          New version is available!
        </Text>
        <Button onPress={() => Linking.openURL(updateUrl)} title="Update Now" />
      </View>
    );
  } else {
    return (
      <SessionProvider>
        <PaperProvider theme={DefaultTheme}>
          <Slot />
        </PaperProvider>
      </SessionProvider>
    );
  }
}
