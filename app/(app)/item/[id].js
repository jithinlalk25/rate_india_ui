import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useSession } from "../../../ctx";
import axios from "axios";
import { Constant } from "../../../constants";
import { Avatar } from "react-native-paper";

export default function Page() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  console.log("=================", id);

  const [data, setData] = useState(null);
  const [ratings, setRatings] = useState(null);
  const { session } = useSession();

  const getData = async () => {
    console.log("+++++++++++", session);
    try {
      const response = await axios.post(
        `${Constant.API_URL}item/getItem`,
        {
          _id: id,
        },
        {
          headers: {
            token: session,
          },
        }
      );
      navigation.setOptions({ title: response.data.name });
      setData(response.data);

      const response1 = await axios.post(
        `${Constant.API_URL}rating/getRatingsByItem`,
        {
          itemId: id,
        },
        {
          headers: {
            token: session,
          },
        }
      );
      setRatings(response1.data);
      // console.log(response.data, typeof response.data);
      // return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  //on first fetch data.
  useEffect(() => {
    getData();
  }, []);

  console.log("+++++++++++++++", data, ratings);

  const renderItem = ({ item, index }) => {
    return (
      <View>
        <Text>{item.rating}</Text>
        <Text>{item.review}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {data && ratings && (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Avatar.Image
              style={{ margin: 5 }}
              size={300}
              source={{ uri: data.image }}
            />
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {data.name}
            </Text>
            <Text style={{ fontSize: 18 }}>{data.description}</Text>
            <Avatar.Text
              size={80}
              label={data.rating}
              color="#000000"
              style={{ backgroundColor: "#FDCC0D" }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              data={ratings}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
            />
          </View>
        </View>
      )}
    </View>
  );
}
