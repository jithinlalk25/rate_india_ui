import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSession } from "../../../ctx";
import axios from "axios";
import { Constant } from "../../../constants";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Modal,
  TextInput,
} from "react-native-paper";
import { Rating } from "@kolking/react-native-rating";

export default function Page() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const [data, setData] = useState(null);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [ratings, setRatings] = useState(null);
  const { session } = useSession();

  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  const addRating = async (itemId, rating, review) => {
    const params = { itemId, rating };
    if (review) {
      params["review"] = review;
    }
    console.log("============", params);
    try {
      const response = await axios.post(
        `${Constant.API_URL}rating/addRating`,
        params,
        {
          headers: {
            token: session,
          },
        }
      );
      hideModal();
    } catch (error) {
      console.error(error);
    }
  };

  const getData = async () => {
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
      if (response.data.userRating) {
        setNewRating(response.data.userRating.rating);
        if (response.data.userRating.review) {
          setNewReview(response.data.userRating.review);
        }
      }

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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const renderItem = ({ item, index }) => {
    const date = new Date(item.createdAt);
    const dateFormatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return (
      <View
        style={{
          marginLeft: 2,
          marginRight: 2,
          paddingTop: 5,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            paddingLeft: 5,
            paddingRight: 5,
          }}
        >
          <Text style={{ fontWeight: "bold", marginRight: 5 }}>
            {item.rating}
          </Text>
          <Rating
            size={15}
            rating={item.rating}
            disabled={true}
            fillColor="gold"
            spacing={2.5}
          />
          <View style={{ flex: 1 }}></View>
          <Text style={{ fontWeight: "bold" }}> {dateFormatted} </Text>
        </View>
        {item.review && (
          <Text style={{ paddingLeft: 5, paddingRight: 5 }}>{item.review}</Text>
        )}

        <Divider style={{ marginTop: 15 }} />
      </View>
    );
  };

  const ratingColor = (rating) => {
    if (rating >= 4.5) {
      return "#57e32c";
    }
    if (rating >= 4) {
      return "#b7dd29";
    }
    if (rating >= 3) {
      return "#ffe234";
    }
    if (rating >= 2) {
      return "#ffa534";
    }
    if (rating > 0) {
      return "#ff4545";
    }
    return "gray";
  };

  return (
    <View style={{ flex: 1 }}>
      {data && ratings && (
        <View style={{ flex: 1 }}>
          <Card
            style={{
              alignItems: "center",
              backgroundColor: "white",
              margin: 10,
              // height: 460,
              flexShrink: 1,
              padding: 10,
            }}
          >
            <Avatar.Image
              style={{
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 10,
                alignSelf: "center",
              }}
              size={300}
              source={{ uri: data.item.image }}
            />
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                alignSelf: "center",
              }}
            >
              {data.item.name}
            </Text>
            <Text
              style={{
                fontSize: 18,
                alignSelf: "center",
                color: "#00008B",
                fontWeight: "bold",
              }}
            >
              {data.item.description}
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 10,
                maxHeight: 60,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  height: 60,
                  marginRight: 10,
                }}
              >
                <View
                  style={{
                    borderWidth: 5,
                    width: 60,
                    height: 60,
                    borderRadius: 50,
                    borderColor: ratingColor(data.item.rating),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 25,
                      fontWeight: "bold",
                    }}
                  >
                    {data.item.rating}
                  </Text>
                </View>
              </View>
              <Rating
                style={{ height: 60, paddingBottom: 6 }}
                size={40}
                rating={data.item.rating}
                disabled={true}
                fillColor="gold"
                spacing={6.6}
              />
            </View>
          </Card>

          <Card
            style={{
              alignItems: "center",
              backgroundColor: "white",
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 10,
              padding: 10,
              backgroundColor: "#5F8575",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", alignSelf: "center" }}
            >
              Your Rating
            </Text>
            <TouchableOpacity
              onPress={showModal}
              style={{ marginTop: 5, marginBottom: 5 }}
            >
              <Rating
                size={30}
                rating={data.userRating ? data.userRating.rating : 0}
                disabled={true}
                fillColor="gold"
                spacing={5}
              />
            </TouchableOpacity>
          </Card>
          <Card
            style={{
              backgroundColor: "white",
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 10,
              padding: 10,
              backgroundColor: "#F0FFFF",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", alignSelf: "center" }}
            >
              All Ratings
            </Text>
            <FlatList
              data={ratings}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
            />
          </Card>
        </View>
      )}
      {data && (
        <Modal
          visible={visible}
          dismissable={false}
          contentContainerStyle={containerStyle}
          style={{ margin: 15 }}
        >
          <View
            style={{
              borderColor: "#5F8575",
              borderWidth: 5,
              borderRadius: 10,
              padding: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ marginBottom: 10, fontSize: 25 }}>
              Rate <Text style={{ fontWeight: "bold" }}>{data.item.name}</Text>
            </Text>
            <Rating
              size={30}
              rating={newRating}
              touchColor="gold"
              fillColor="gold"
              spacing={5}
              onChange={setNewRating}
            />
            <TextInput
              style={{ width: "100%", marginTop: 10 }}
              label="Review"
              mode="outlined"
              multiline={true}
              numberOfLines={5}
              value={newReview}
              onChangeText={(text) => setNewReview(text)}
            />
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <Button mode="text" onPress={hideModal}>
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={() =>
                  addRating(
                    data.item._id,
                    newRating,
                    newReview.trim().length > 0 ? newReview.trim() : null
                  )
                }
              >
                Save
              </Button>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
