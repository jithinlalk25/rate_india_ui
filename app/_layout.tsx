import { Slot } from "expo-router";
import { SessionProvider, useSession } from "../ctx";
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
  const { signOut } = useSession();
  const [screenToShow, setScreenToShow] = useState("LOADING");
  const [downTime, setDownTime] = useState("");
  const [updateUrl, setUpdateUrl] = useState("");

  const getConfig = async () => {
    try {
      const response = await axios.get(`${Constant.API_URL}config/getConfig`);
      if (response.data.IS_APP_DOWN.value) {
        setDownTime(response.data.IS_APP_DOWN.time);
        setScreenToShow("DOWN");
      } else if (Platform.OS == "ios") {
        if (response.data.MIN_APP_VERSION.ios > Constant.APP_VERSION) {
          setUpdateUrl(response.data.APP_URL.appstore);
          setScreenToShow("UPDATE");
        } else {
          setScreenToShow("DEFAULT");
        }
      } else {
        if (response.data.MIN_APP_VERSION.android > Constant.APP_VERSION) {
          setUpdateUrl(response.data.APP_URL.playstore);
          setScreenToShow("UPDATE");
        } else {
          setScreenToShow("DEFAULT");
        }
      }
    } catch (error: any) {
      if (error.response.status == 401) {
        signOut();
      }
      console.error(error);
    }
  };

  useEffect(() => {
    getConfig();
  }, []);

  if (screenToShow == "LOADING") {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (screenToShow == "DOWN") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: "gray",
            marginBottom: 10,
          }}
        >
          App is under maintenance
        </Text>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: "gray",
          }}
        >
          Will be live by{" "}
          <Text style={{ fontWeight: "bold", color: "black" }}>{downTime}</Text>
        </Text>
      </View>
    );
  } else if (screenToShow == "UPDATE") {
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
