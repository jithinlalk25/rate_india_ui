import { useState } from "react";
import { Alert, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSession } from "../../../../ctx";
import { Constant } from "../../../../constants";
import axios from "axios";

export default renderItem = ({ item }) => {
  const { session, signOut } = useSession();
  const [isLiked, setIsLiked] = useState(Boolean(item.isLiked));
  const [isReported, setIsReported] = useState(Boolean(item.isReported));
  const [isDeleted, setIsDeleted] = useState(false);

  item.likeCount = item.likeCount || 0;

  const updateLike = async () => {
    try {
      const api = !isLiked
        ? `${Constant.API_URL}rating/addCommentLike`
        : `${Constant.API_URL}rating/removeCommentLike`;

      item.likeCount += !isLiked ? 1 : -1;

      setIsLiked(!isLiked);

      const response = await axios.post(
        api,
        { commentId: item._id },
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
        ? `${Constant.API_URL}rating/addCommentReport`
        : `${Constant.API_URL}rating/removeCommentReport`;

      setIsReported(!isReported);

      const response = await axios.post(
        api,
        { commentId: item._id },
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

  const deleteComment = async (commentId) => {
    try {
      const response = await axios.post(
        `${Constant.API_URL}rating/deleteComment`,
        { commentId },
        {
          headers: {
            token: session,
          },
        }
      );
      setIsDeleted(true);
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
    hour: "numeric",
    minute: "numeric",
  });
  return (
    !isDeleted && (
      <View
        style={{
          marginLeft: 10,
          marginRight: 10,
          marginTop: 5,
          paddingTop: 5,
          borderBottomWidth: 0.5,
          borderColor: "gray",
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
          <View style={{ flex: 1 }}></View>
          <Text style={{}}> {dateFormatted} </Text>
        </View>
        <View>
          <Text style={{ paddingLeft: 5, paddingRight: 5 }}>
            {item.comment}
          </Text>
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
            <Button
              icon="delete"
              mode="text"
              onPress={() => {
                Alert.alert("Delete", "Are you sure to delete your comment?", [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      deleteComment(item._id);
                    },
                  },
                ]);
              }}
            >
              Delete
            </Button>
          </View>
        </View>
      </View>
    )
  );
};
