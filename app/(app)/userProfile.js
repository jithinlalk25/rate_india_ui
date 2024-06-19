import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useSession } from "../../ctx";
import axios from "axios";
import { Constant } from "../../constants";
import { Button } from "react-native-paper";
import { ActivityIndicator } from "react-native-paper";

const userProfile = () => {
  const [data, setData] = useState(null);
  const { session, signOut } = useSession();
  const [loading, setLoading] = useState(false);

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

  const getUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Constant.API_URL}user`, {
        headers: {
          token: session,
        },
      });
      setData(response.data);
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
  }, []);

  return (
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
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>
              {data.phoneNumber}
            </Text>
          )}
        </View>
        <Button
          mode="outlined"
          onPress={() => {
            logout();
            signOut();
          }}
          style={{ width: 100, alignSelf: "center" }}
        >
          Logout
        </Button>
      </View>
      <Text>App Version: {Constant.APP_VERSION}</Text>
    </View>
  );
};

export default userProfile;
