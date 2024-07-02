import { View, Text } from "react-native";
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
        <Text>App Version: {Constant.APP_VERSION}</Text>
      </View>
    </View>
  );
};

export default userProfile;
