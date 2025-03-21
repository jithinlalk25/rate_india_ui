import { View, Text, Linking, Platform, Share } from "react-native";
import React, { useEffect, useState } from "react";
import { useSession } from "../../ctx";
import axios from "axios";
import { Constant } from "../../constants";
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  TextInput,
} from "react-native-paper";
import { ActivityIndicator } from "react-native-paper";

const userProfile = () => {
  const [data, setData] = useState(null);
  const { session, signOut } = useSession();
  const [loading, setLoading] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [refreshUserData, setRefreshUserData] = useState(0);

  const logout = async () => {
    try {
      await axios.post(
        `${Constant.API_URL}auth/logout`,
        {},
        {
          headers: {
            token: session,
          },
        }
      );
    } catch (error) {
      console.error(error);
      if (error.response.status == 401) {
        signOut();
      }
    }
  };

  const updateUserData = async () => {
    try {
      const response = await axios.post(
        `${Constant.API_URL}user/updateUserData`,
        {
          username: newUsername,
        },
        {
          headers: {
            token: session,
          },
        }
      );
      setDialogVisible(false);
      setRefreshUserData(refreshUserData + 1);
    } catch (error) {
      console.error(error);
      if (error.response.status == 409) {
        setUsernameError("Username already exist");
      }
    }
  };

  const getUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Constant.API_URL}user`, {
        headers: {
          token: session,
        },
      });
      setData(response.data);
      setNewUsername(response.data.username);
    } catch (error) {
      console.error(error);
      if (error.response.status == 401) {
        signOut();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getUser();
  }, [refreshUserData]);

  return (
    <View style={{ flex: 1 }}>
      <Portal>
        <Dialog visible={dialogVisible} dismissable={false}>
          <Dialog.Title style={{ alignSelf: "center" }}>
            Edit your username
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              style={{ margin: 10, width: 200, alignSelf: "center" }}
              label="Username"
              value={newUsername}
              error={usernameError}
              onChangeText={(data) => {
                const allowedPattern = /^[a-zA-Z0-9_.-]{0,30}$/;
                if (allowedPattern.test(data)) {
                  setNewUsername(data);
                  setUsernameError("");
                }
              }}
              maxLength={30}
            />
            {usernameError ? (
              <Text
                style={{
                  color: "red",
                  marginTop: 8,
                  alignSelf: "center",
                }}
              >
                {usernameError}
              </Text>
            ) : null}
            <Text>
              • Minimum length is 3{"\n"}• Allowed characters - alphabets,
              numbers, _, -, .
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button disabled={newUsername.length < 3} onPress={updateUserData}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View
        style={{
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 20,
          paddingRight: 20,
          flex: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View></View>
        <View>
          <View
            style={{
              paddingTop: 10,
              paddingBottom: 10,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {loading || !data ? (
              <ActivityIndicator style={{ height: 30 }} />
            ) : (
              <View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontSize: 20,
                      alignSelf: "center",
                    }}
                  >
                    Username:{" "}
                    <Text style={{ color: "darkblue", fontWeight: "bold" }}>
                      {data.username}
                    </Text>
                  </Text>
                  <IconButton
                    icon="pencil"
                    size={20}
                    iconColor="black"
                    style={{ padding: 0, margin: 0 }}
                    onPress={() => setDialogVisible(true)}
                  />
                </View>
                <Text style={{ fontSize: 20 }}>
                  Phone Number:{" "}
                  <Text style={{ color: "darkblue", fontWeight: "bold" }}>
                    {data.phoneNumber}
                  </Text>
                </Text>
              </View>
            )}
          </View>
          <Button
            mode="outlined"
            onPress={() => {
              logout();
              signOut();
            }}
            style={{ alignSelf: "center" }}
          >
            Logout
          </Button>
        </View>
        <View>
          <Button
            icon="thumb-up"
            mode="elevated"
            textColor="darkgreen"
            onPress={() => {
              if (Platform.OS === "ios") {
                Linking.openURL(
                  "https://apps.apple.com/in/app/rate-india/id6504734648"
                );
              } else {
                Linking.openURL(
                  "https://play.google.com/store/apps/details?id=com.androjlk.rateindia"
                );
              }
            }}
            style={{ alignSelf: "center" }}
          >
            Rate Us
          </Button>
          <Button
            icon="share-variant"
            mode="elevated"
            textColor="darkgreen"
            onPress={shareApp}
            style={{ alignSelf: "center", marginTop: 20 }}
          >
            Share Rate India
          </Button>
          <Button
            icon="facebook"
            mode="elevated"
            textColor="darkgreen"
            onPress={() =>
              Linking.openURL(
                "https://www.facebook.com/profile.php?id=61562122377188"
              )
            }
            style={{ alignSelf: "center", marginTop: 20 }}
          >
            Facebook
          </Button>
        </View>
        <View>
          <Text
            style={{
              color: "darkorange",
              alignSelf: "center",
              fontWeight: "bold",
              fontSize: 20,
              marginBottom: 20,
            }}
            onPress={() => Linking.openURL("https://rateindia.in/")}
          >
            rateindia.in
          </Text>
          <Text
            style={{
              color: "blue",
              textDecorationLine: "underline",
              alignSelf: "center",
              fontWeight: "bold",
              fontSize: 20,
            }}
            onPress={() => Linking.openURL("mailto:support@rateindia.in")}
          >
            support@rateindia.in
          </Text>
          <Text
            style={{
              color: "gray",
              marginTop: 20,
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                color: "blue",
                textDecorationLine: "underline",
                alignSelf: "center",
              }}
              onPress={() =>
                Linking.openURL(
                  "https://sites.google.com/view/rate-india-terms/home"
                )
              }
            >
              Terms & Conditions
            </Text>{" "}
            •{" "}
            <Text
              style={{
                color: "blue",
                textDecorationLine: "underline",
                alignSelf: "center",
              }}
              onPress={() =>
                Linking.openURL(
                  "https://sites.google.com/view/rateindia-privacypolicy/home"
                )
              }
            >
              Privacy Policy
            </Text>{" "}
            •{" "}
            <Text
              style={{
                color: "blue",
                textDecorationLine: "underline",
                alignSelf: "center",
              }}
              onPress={() =>
                Linking.openURL(
                  "https://sites.google.com/view/rate-india-disclaimer/home"
                )
              }
            >
              Disclaimer
            </Text>
          </Text>
          <Text
            style={{
              color: "gray",
              alignSelf: "center",
              fontSize: 10,
            }}
          >
            version: {Constant.APP_VERSION}
          </Text>
        </View>
      </View>
    </View>
  );
};

const shareApp = async (text) => {
  try {
    const result = await Share.share({
      message: `🇮🇳 Rate India 🇮🇳

Rate and review Indian politicians. Discover who the public loves!

Download Rate India now and start rating your favourite politician today!

📱 Android - https://play.google.com/store/apps/details?id=com.androjlk.rateindia

📱 IOS - https://apps.apple.com/in/app/rate-india/id6504734648`,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log("Shared with activity type:", result.activityType);
      } else {
        console.log("Shared successfully");
      }
    } else if (result.action === Share.dismissedAction) {
      console.log("Share dismissed");
    }
  } catch (error) {
    alert(error.message);
  }
};

export default userProfile;
