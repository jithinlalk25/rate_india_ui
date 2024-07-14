import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSession } from "../../../../ctx";
import axios from "axios";
import { Constant } from "../../../../constants";
import {
  ActivityIndicator,
  Button,
  Card,
  Dialog,
  Divider,
  Portal,
  TextInput,
} from "react-native-paper";
import { Rating } from "@kolking/react-native-rating";
import CommentComponent from "./commentComponent";

export default function Page() {
  const { session, signOut } = useSession();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [item, setItem] = useState(null);
  const [dateFormatted, setDateFormatted] = useState("");
  const [comment, setComment] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [commentList, setCommentList] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [refreshComments, setRefreshComments] = useState(0);

  const getCommentsByRating = async (pageNumber = 1) => {
    if (loading || !hasMore) return;

    setLoading(true);

    const params = { ratingId: id };

    if (commentList.length > 0) {
      params["lastId"] = commentList.at(-1)._id;
    }

    try {
      const response = await axios.post(
        `${Constant.API_URL}rating/getCommentsByRating`,
        params,
        {
          headers: {
            token: session,
          },
        }
      );

      const newData = response.data;
      setCommentList((prevData) => [...prevData, ...newData]);
      setPage(pageNumber);
      setHasMore(newData.length > 0);
    } catch (error) {
      console.error(error);
      if (error.response.status == 401) {
        signOut();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCommentsByRating();
  }, [refreshComments]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      getCommentsByRating(page + 1);
    }
  };

  const renderFooter = () => {
    return loading ? <ActivityIndicator style={styles.loader} /> : null;
  };

  const getData = async () => {
    try {
      const response = await axios.post(
        `${Constant.API_URL}rating/getRating`,
        {
          ratingId: id,
        },
        {
          headers: {
            token: session,
          },
        }
      );

      response.data.likeCount = response.data.likeCount || 0;
      const date = new Date(response.data.createdAt);
      setDateFormatted(
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
      setIsLiked(Boolean(response.data.isLiked));
      setIsReported(Boolean(response.data.isReported));
      navigation.setOptions({ title: response.data.itemName });
      setItem(response.data);
    } catch (error) {
      console.error(error);
      if (error.response.status == 401) {
        signOut();
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const addComment = async () => {
    try {
      const api = `${Constant.API_URL}rating/addComment`;

      const response = await axios.post(
        api,
        { reviewId: item._id, comment: comment.trim() },
        {
          headers: {
            token: session,
          },
        }
      );

      setComment("");
      setDialogVisible(false);
      setPage(1);
      setLoading(false);
      setHasMore(true);
      setCommentList([]);
      setRefreshComments(refreshComments + 1);
    } catch (error) {
      console.error(error);
      if (error.response.status == 401) {
        signOut();
      }
    }
  };

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

  const HeaderComponent = () => (
    <View style={{ backgroundColor: "gray" }}>
      <Card
        style={{
          marginLeft: 5,
          marginRight: 5,
          padding: 5,
          paddingTop: 10,
          marginTop: 10,
          backgroundColor: "lightblue",
        }}
      >
        <View
          style={{
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
            <Text
              style={{ paddingLeft: 5, paddingRight: 5, fontWeight: "bold" }}
            >
              {item.review}
            </Text>
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
      </Card>
      <View>
        <Button
          icon="comment-outline"
          mode="contained"
          style={{ marginTop: 10, marginBottom: 5, alignSelf: "center" }}
          size={25}
          onPress={() => setDialogVisible(true)}
        >
          Add Comment
        </Button>
      </View>
      <Divider style={{ marginTop: 5 }} />
    </View>
  );

  return item ? (
    <View>
      <Portal>
        <Dialog visible={dialogVisible} dismissable={false}>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              style={{ margin: 10, width: "100%", alignSelf: "center" }}
              label="Comment"
              value={comment}
              onChangeText={setComment}
              numberOfLines={5}
              multiline={true}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button disabled={comment.trim().length < 1} onPress={addComment}>
              Add Comment
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <FlatList
        ListHeaderComponent={HeaderComponent}
        data={commentList}
        renderItem={(item) => <CommentComponent item={item.item} />}
        keyExtractor={(item) => item._id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListHeaderComponentStyle={{ marginBottom: 10 }}
        ListFooterComponentStyle={{ marginTop: 10 }}
      />
    </View>
  ) : (
    <ActivityIndicator style={styles.loader} />
  );
}

const styles = StyleSheet.create({
  loader: {
    marginVertical: 100,
  },
});
