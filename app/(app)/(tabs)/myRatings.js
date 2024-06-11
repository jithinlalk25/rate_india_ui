import { FlatList, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, IconButton, Text } from "react-native-paper";
import { useSession } from "../../../ctx";
import axios from "axios";
import { Constant } from "../../../constants";
import { router } from "expo-router";
import { AirbnbRating } from "react-native-ratings";

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
      console.log("==========", response.data);
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
  // const renderItem = ({ item, index }) => {
  //   return (
  //     <View>
  //       <Text>{item.itemId}</Text>
  //       <Text>{item.rating}</Text>
  //       <Text>{item.review}</Text>
  //       <Button
  //         mode="contained"
  //         onPress={() => router.navigate(`/item/${item.itemId}`)}
  //       >
  //         Edit
  //       </Button>
  //     </View>
  //   );
  // };

  const renderItem = ({ item, index }) => {
    const date = new Date(item.createdAt);
    const dateFormatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return (
      <Card
        style={{
          // backgroundColor: "white",
          marginLeft: 2,
          marginRight: 2,
          marginBottom: 2,
          borderColor: "black",
          borderWidth: 1,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row", padding: 10 }}>
          <Avatar.Image
            style={{ margin: 5 }}
            size={55}
            source={{ uri: item.item.image }}
          />
          <View style={{ flex: 1, justifyContent: "center", marginLeft: 5 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {item.item.name}
            </Text>
            <Text style={{ color: "#666" }}> {item.item.description} </Text>
            <Text style={{ fontWeight: "bold" }}> {dateFormatted} </Text>
          </View>
          <View style={{ justifyContent: "center" }}>
            <View style={{}}>
              <AirbnbRating
                count={5}
                defaultRating={item.rating}
                size={20}
                showRating={false}
                isDisabled={true}
              />
            </View>
            {/* <IconButton
              icon="account"
              iconColor="#000000"
              size={10}
              onPress={() => router.navigate(`/item/${item.item._id}`)}
            /> */}
            <Button
              style={{}}
              icon="pen"
              mode="text"
              onPress={() => router.navigate(`/item/${item.item._id}`)}
            >
              Edit
            </Button>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={{ paddingTop: 2 }}>
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
