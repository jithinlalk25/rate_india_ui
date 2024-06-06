import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useSession } from "../../ctx";
import axios from "axios";
import { Constant } from "../../constants";
import { Button } from "react-native-paper";

const userProfile = () => {
  const [data, setData] = useState(null);
  const { session, signOut } = useSession();

  const logout = async () => {
    console.log("+++++++++++", session);
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
      // return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = async () => {
    console.log("+++++++++++", session);
    try {
      const response = await axios.get(`${Constant.API_URL}user`, {
        headers: {
          token: session,
        },
      });
      setData(response.data);
      console.log(response.data, typeof response.data);
      // return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  //on first fetch data.
  useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={{ paddingTop: 5 }}>
      {data && <Text>Phone Number : {data.phoneNumber}</Text>}
      <Button
        mode="contained"
        onPress={() => {
          logout();
          signOut();
        }}
      >
        Logout
      </Button>
    </View>
  );
};

export default userProfile;
