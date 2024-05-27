import { FlatList, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Text } from "react-native-paper";
import { useSession } from "../../ctx";
import axios from "axios";

const index = () => {
  const [data, setData] = useState(null);
  const { session } = useSession();

  const getAllItems = async () => {
    console.log("+++++++++++", session);
    try {
      const response = await axios.get(
        "http://192.168.1.32:3000/item/getAllItems",
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
    getAllItems();
  }, []);

  // return <View></View>;
  const renderItem = ({ item, index }) => {
    return (
      <View>
        <Avatar.Image size={100} source={{ uri: item.image }} />
        <Text>
          {index}. {item.name}
        </Text>
        <Text> Description: {item.description} </Text>
        {/* <Text> Ingredient : {item.ingredients}</Text> */}
      </View>
    );
  };

  return (
    <View>
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
