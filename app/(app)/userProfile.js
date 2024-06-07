import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useSession } from "../../ctx";
import axios from "axios";
import { Constant } from "../../constants";
import { Button } from "react-native-paper";
import { ActivityIndicator } from 'react-native-paper';

const userProfile = () => {
  const [data, setData] = useState(null);
  const { session, signOut } = useSession();
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
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
    setLoading(false);
  };

  //on first fetch data.
  useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={{ paddingTop: 20, paddingBottom:20, paddingLeft:20, paddingRight:20., flex:1, justifyContent:'center' }}>
      <View style={{ paddingTop:10, paddingBottom:10, display:'flex', flexDirection:'row', justifyContent:'center' }}>
        {loading || !data ? <ActivityIndicator style={{ height:30 }}/> : <Text style={{ height:30, color:'#444', fontSize:16 }}>Phone Number : {data.phoneNumber}</Text>}
      </View>
      <Button
        mode="contained"
        onPress={() => {
          logout();
          signOut();
        }}
        style={{ justifyContent:'center' }}
      >
        Logout
      </Button>
    </View>
  );
};

export default userProfile;
