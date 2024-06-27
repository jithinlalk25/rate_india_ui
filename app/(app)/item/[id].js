import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useSession } from "../../../ctx";
import axios from "axios";
import { Constant } from "../../../constants";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Dialog,
  IconButton,
  Modal,
  Portal,
  RadioButton,
  TextInput,
} from "react-native-paper";
import { Rating } from "@kolking/react-native-rating";
import RatingComponent from "./ratingComponent";

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0);

  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const [data, setData] = useState(null);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const { session, signOut } = useSession();
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [filterDialogVisible, setFilterDialogVisible] = useState(false);
  const [sortDialogVisible, setSortDialogVisible] = useState(false);
  const [filterValue, setFilterValue] = useState("ALL_RATINGS");
  const [sortValue, setSortValue] = useState("relevance");
  const [refreshRatings, setRefreshRatings] = useState(0);

  const refreshComponent = () => {
    setData(null);
    setNewRating(0);
    setNewReview("");
    setRatings([]);
    setPage(1);
    setLoading(false);
    setHasMore(true);
    setRefreshKey(refreshKey + 1);
  };

  const getRatingsByItem = async (pageNumber = 1) => {
    if (loading || !hasMore) return;

    setLoading(true);

    const params = { itemId: id, sortBy: sortValue };

    if (filterValue == "RATINGS_WITH_REVIEWS") {
      params["filter"] = "WITH_REVIEW";
    }
    if (ratings.length > 0) {
      params["lastId"] = ratings.at(-1)._id;
    }

    try {
      const response = await axios.post(
        `${Constant.API_URL}rating/getRatingsByItem`,
        params,
        {
          headers: {
            token: session,
          },
        }
      );

      const newData = response.data;
      setRatings((prevData) => [...prevData, ...newData]);
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
    getRatingsByItem();
  }, [refreshKey, refreshRatings]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      getRatingsByItem(page + 1);
    }
  };

  const renderFooter = () => {
    return loading ? <ActivityIndicator style={styles.loader} /> : null;
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  const deleteRating = async (itemId) => {
    try {
      const response = await axios.post(
        `${Constant.API_URL}rating/deleteRating`,
        { itemId },
        {
          headers: {
            token: session,
          },
        }
      );
      refreshComponent();
    } catch (error) {
      console.error(error);
      if (error.response.status == 401) {
        signOut();
      }
    }
  };

  const addRating = async (itemId, rating, review) => {
    setModalLoading(true);
    const params = { itemId, rating };
    if (review) {
      params["review"] = review;
    }
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
      refreshComponent();
    } catch (error) {
      console.error(error);
      if (error.response.status == 401) {
        signOut();
      }
    } finally {
      setModalLoading(false);
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
    } catch (error) {
      console.error(error);
      if (error.response.status == 401) {
        signOut();
      }
    }
  };

  useEffect(() => {
    getData();
  }, [refreshKey]);

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

  const HeaderComponent = () => (
    <>
      <Card
        style={{
          alignItems: "center",
          backgroundColor: "#F0F0F0",
          margin: 10,
          flexShrink: 1,
          padding: 10,
        }}
      >
        <Avatar.Image
          style={{
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 5,
            alignSelf: "center",
          }}
          size={200}
          source={{ uri: data.item.image }}
        />
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            alignSelf: "center",
          }}
        >
          {data.item.name}
        </Text>
        <Text
          style={{
            fontSize: 15,
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
            maxHeight: 50,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              height: 50,
              marginRight: 10,
            }}
          >
            <View
              style={{
                borderWidth: 4,
                width: 50,
                height: 50,
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
          <View style={{ height: 50, paddingBottom: 6 }}>
            <Rating
              style={{}}
              size={30}
              rating={data.item.rating}
              disabled={true}
              fillColor="gold"
              baseColor="lightgray"
              spacing={4.5}
            />
            <Text style={{ alignSelf: "center", fontWeight: "bold" }}>
              ( {data.item.ratingCount} )
            </Text>
          </View>
        </View>
      </Card>
      {data.userRating ? (
        <Card
          style={{
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 10,
            paddingTop: 5,
            paddingLeft: 15,
            paddingRight: 15,

            backgroundColor: "#5F855F",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",

                paddingTop: 8,
                color: "white",
              }}
            >
              Your Rating
            </Text>
            <View style={{ flex: 1 }}></View>

            <IconButton
              icon="pencil"
              size={20}
              iconColor="white"
              style={{ padding: 0, margin: 0 }}
              onPress={showModal}
            />

            <IconButton
              icon="delete"
              iconColor="white"
              size={20}
              style={{ padding: 0, margin: 0 }}
              onPress={() => {
                Alert.alert("Delete", "Are you sure to delete your rating?", [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      deleteRating(data.item._id);
                    },
                  },
                ]);
              }}
            />
          </View>
          <Rating
            style={{ marginTop: 5 }}
            size={30}
            rating={data.userRating.rating}
            disabled={true}
            fillColor="gold"
            baseColor="lightgray"
            spacing={4.5}
          />
          {data.userRating?.review && (
            <Text
              style={{
                marginTop: 10,
                fontSize: 15,
                color: "#E1E1E1",
              }}
            >
              {data.userRating.review}
            </Text>
          )}
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              marginBottom: 10,
            }}
          ></View>
        </Card>
      ) : (
        <Card
          style={{
            alignItems: "center",
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 10,
            paddingTop: 5,
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 15,
            backgroundColor: "#5F855F",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              alignSelf: "center",
              paddingTop: 8,
              color: "white",
            }}
          >
            Give your Rating
          </Text>
          <Rating
            style={{ marginTop: 10, marginBottom: 5 }}
            size={30}
            rating={0}
            touchColor="gold"
            baseColor="lightgray"
            fillColor="gold"
            onChange={(rating) => {
              setNewRating(rating);
              showModal();
            }}
            spacing={4.5}
          />
        </Card>
      )}
      <Portal>
        <Dialog visible={filterDialogVisible} dismissable={false}>
          <Dialog.Title>Filter</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(newValue) => setFilterValue(newValue)}
              value={filterValue}
            >
              <View style={{ flexDirection: "row" }}>
                <RadioButton value="ALL_RATINGS" />
                <Text style={{ paddingTop: 8 }}>All Ratings</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <RadioButton value="RATINGS_WITH_REVIEWS" />
                <Text style={{ paddingTop: 8 }}>Ratings with reviews</Text>
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setFilterDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              onPress={() => {
                setRatings([]);
                setPage(1);
                setLoading(false);
                setHasMore(true);
                setRefreshRatings(refreshRatings + 1);
                setFilterDialogVisible(false);
              }}
            >
              Update
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog visible={sortDialogVisible} dismissable={false}>
          <Dialog.Title>Sort</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(newValue) => setSortValue(newValue)}
              value={sortValue}
            >
              <View style={{ flexDirection: "row" }}>
                <RadioButton value="relevance" />
                <Text style={{ paddingTop: 8 }}>Relevance</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <RadioButton value="newest" />
                <Text style={{ paddingTop: 8 }}>Newest</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <RadioButton value="oldest" />
                <Text style={{ paddingTop: 8 }}>Oldest</Text>
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSortDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={() => {
                setRatings([]);
                setPage(1);
                setLoading(false);
                setHasMore(true);
                setRefreshRatings(refreshRatings + 1);
                setSortDialogVisible(false);
              }}
            >
              Update
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {ratings?.length > 0 && (
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginLeft: 10,
              color: "#454545",
            }}
          >
            All Ratings
          </Text>
          <View style={{ flex: 1 }}></View>
          <Button
            icon="filter-outline"
            mode="text"
            onPress={() => setFilterDialogVisible(true)}
          >
            Filter
          </Button>
          <Button
            icon="sort"
            mode="text"
            onPress={() => setSortDialogVisible(true)}
          >
            Sort
          </Button>
        </View>
      )}
    </>
  );

  return (
    <View>
      {data && (
        <FlatList
          ListHeaderComponent={HeaderComponent}
          data={ratings}
          renderItem={(item) => <RatingComponent item={item.item} />}
          keyExtractor={(item) => item._id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListHeaderComponentStyle={{ marginBottom: 10 }}
          ListFooterComponentStyle={{ marginTop: 10 }}
        />
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
              baseColor="lightgray"
              fillColor="gold"
              spacing={4.5}
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
              {modalLoading && <ActivityIndicator />}
              {!modalLoading && (
                <Button mode="text" onPress={hideModal}>
                  Cancel
                </Button>
              )}
              {!modalLoading && (
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
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginVertical: 100,
  },
});
