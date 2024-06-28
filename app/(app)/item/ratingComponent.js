import { Rating } from "@kolking/react-native-rating";
import { useState } from "react";
import { View } from "react-native";
import { Button, Divider, Text } from "react-native-paper";
import { useSession } from "../../../ctx";
import { Constant } from "../../../constants";
import axios from "axios";

export default renderItem = ({ item }) => {
  const { session, signOut } = useSession();
  const [isLiked, setIsLiked] = useState(Boolean(item.isLiked));
  const [isReported, setIsReported] = useState(Boolean(item.isReported));

  item.likeCount = item.likeCount || 0;

  const updateLike = async () => {
    try {
      const api = !isLiked
        ? `${Constant.API_URL}rating/addLike`
        : `${Constant.API_URL}rating/removeLike`;

      item.likeCount += !isLiked ? 1 : -1;

      setIsLiked(!isLiked);

      const response = await axios.post(
        api,
        { reviewId: item._id },
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

  const updateReport = async () => {
    try {
      const api = !isReported
        ? `${Constant.API_URL}rating/addReport`
        : `${Constant.API_URL}rating/removeReport`;

      setIsReported(!isReported);

      const response = await axios.post(
        api,
        { reviewId: item._id },
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

  const date = new Date(item.createdAt);
  const dateFormatted = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <View
      style={{
        marginLeft: 10,
        marginRight: 10,
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
        <Text
          style={{ fontWeight: "bold", marginRight: 5, color: "darkgreen" }}
        >
          {item.username}
        </Text>
        <Text style={{ fontWeight: "bold", marginRight: 5 }}>
          {item.rating}
        </Text>
        <Rating
          size={15}
          rating={item.rating}
          disabled={true}
          fillColor="gold"
          baseColor="lightgray"
          spacing={2.25}
        />
        <View style={{ flex: 1 }}></View>
        <Text style={{}}> {dateFormatted} </Text>
      </View>
      {item.review && (
        <View>
          <Text style={{ paddingLeft: 5, paddingRight: 5 }}>{item.review}</Text>
          {item.isEdited && (
            <Text
              style={{
                alignSelf: "flex-end",
                fontSize: 13,
                color: "gray",
                paddingRight: 5,
              }}
            >
              Edited
            </Text>
          )}
          <View style={{ flexDirection: "row" }}>
            <Button
              icon={isReported ? "flag" : "flag-outline"}
              mode="text"
              onPress={updateReport}
            >
              {isReported ? "Reported" : "Report"}
            </Button>
            <View style={{ flex: 1 }}></View>
            <Text style={{ paddingTop: 10, fontWeight: "bold" }}>
              {item.likeCount}
            </Text>
            <Button
              icon={isLiked ? "thumb-up" : "thumb-up-outline"}
              mode="text"
              onPress={updateLike}
            >
              {isLiked ? "Liked" : "Like"}
            </Button>
          </View>
        </View>
      )}

      <Divider style={{ marginTop: item.review ? 0 : 15 }} />
    </View>
  );
};
