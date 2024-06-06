import { FlatList, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Text } from "react-native-paper";
import { useSession } from "../../../ctx";
import axios from "axios";
import { Constant } from "../../../constants";
import { router } from "expo-router";

const index = () => {
  const [data, setData] = useState(null);
  const { session } = useSession();

  const getRatingsByUser = async () => {
    console.log("+++++++++++", session);
    try {
      const response = await axios.post(
        `${Constant.API_URL}rating/getRatingsByUser`,
        {},
        {
          headers: {
            token: session,
          },
        }
      );
      setData(response.data);
      // console.log(response.data, typeof response.data);
      // return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  //on first fetch data.
  useEffect(() => {
    getRatingsByUser();
  }, []);

  // return <View></View>;
  const renderItem = ({ item, index }) => {
    return (
      <View>
        <Text>{item.itemId}</Text>
        <Text>{item.rating}</Text>
        <Text>{item.review}</Text>
        <Button
          mode="contained"
          onPress={() => router.navigate(`/item/${item.itemId}`)}
        >
          Edit
        </Button>
      </View>
    );
  };

  return (
    <View style={{ paddingTop: 5 }}>
      {data && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

export default index;
