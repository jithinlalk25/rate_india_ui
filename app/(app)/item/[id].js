import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSession } from "../../../ctx";
import axios from "axios";
import { Constant } from "../../../constants";
import { Avatar, Button, Modal } from "react-native-paper";
import { AirbnbRating } from "react-native-ratings";

export default function Page() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  console.log("=================", id);

  const [data, setData] = useState(null);
  const [ratings, setRatings] = useState(null);
  const { session } = useSession();

  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

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
      navigation.setOptions({ title: response.data.item.name });
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
              style={{ margin: 5, marginTop:20 }}
              size={300}
              source={{ uri: data.item.image }}
            />
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {data.item.name}
            </Text>
            <Text style={{ fontSize: 18 }}>{data.item.description}</Text>
            <View
              style={{
                flexDirection: "row",
                marginTop:10, 
              }}
            >
              <View style={{ display:"flex", flexDirection:"column", justifyContent:"center" }}>
                <Text
                  color="#000000"
                  style={{
                    fontSize:20,
                    fongWeight:"bold",
                  }}
                >
                  {data.item.rating}
                </Text>
              </View>
              <View style={{ alignItems: "center", display:"flex", flexDirection:"column", justifyContent:"center", marginLeft:10 }}>
                <AirbnbRating
                  count={5}
                  defaultRating={data.item.rating}
                  size={40}
                  showRating={false}
                  isDisabled={true}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              borderColor: "black",
              borderWidth: 1,
              display:"flex",
              flexDirection:"row",
              paddingLeft:10,
              paddingTop:10,
              paddingBottom:10
            }}
          >
            <View style={{ display:"flex", flexDirection:"column", justifyContent:"center" , marginRight:10 }}>
              <Text style={{ fontSize:16, fontWeight:'400' }}>Hello</Text>
            </View>
            <View>
              <TouchableOpacity onPress={showModal}>
                <AirbnbRating
                  count={5}
                  defaultRating={data.userRating ? data.userRating.rating : 0}
                  size={40}
                  showRating={false}
                  isDisabled={true}
                  on
                />
              </TouchableOpacity>
             </View>
          </View>
          <View>
            <FlatList
              data={ratings}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
            />
          </View>
        </View>
      )}
      <Modal
        visible={visible}
        dismissable={false}
        contentContainerStyle={containerStyle}
      >
        <Text>Example Modal. Click outside this area to dismiss.</Text>
        <Button onPress={hideModal}>Dismiss</Button>
      </Modal>
    </View>
  );
}
