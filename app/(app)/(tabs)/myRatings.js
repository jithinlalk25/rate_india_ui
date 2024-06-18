import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Avatar, Card, Text } from "react-native-paper";
import { useSession } from "../../../ctx";
import axios from "axios";
import { Constant } from "../../../constants";
import { router, useFocusEffect } from "expo-router";
import { Rating } from "@kolking/react-native-rating";

const index = () => {
  const [data, setData] = useState([]);
  const { session } = useSession();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getRatingsByUser();
      return () => {
        setData([]);
        setPage(1);
        setLoading(false);
        setHasMore(true);
      };
    }, [])
  );

  const getRatingsByUser = async (pageNumber = 1) => {
    if (loading || !hasMore) return;

    setLoading(true);

    const params = data.length > 0 ? { lastId: data.at(-1)._id } : {};

    try {
      const response = await axios.post(
        `${Constant.API_URL}rating/getRatingsByUser`,
        params,
        {
          headers: {
            token: session,
          },
        }
      );
      const newData = response.data;
      setData((prevData) => [...prevData, ...newData]);
      setPage(pageNumber);
      setHasMore(newData.length > 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      getRatingsByUser(page + 1);
    }
  };

  const renderFooter = () => {
    return loading ? <ActivityIndicator style={styles.loader} /> : null;
  };

  const renderItem = ({ item, index }) => {
    const date = new Date(item.createdAt);
    const dateFormatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return (
      <TouchableOpacity
        onPress={() => router.navigate(`/item/${item.item._id}`)}
      >
        <Card
          style={{
            marginLeft: 2,
            marginRight: 2,
            marginBottom: 2,
            borderColor: "black",
            borderWidth: 0.5,
          }}
        >
          <View style={{ flex: 1, flexDirection: "row", padding: 3 }}>
            <Avatar.Image
              style={{ margin: 5 }}
              size={55}
              source={{ uri: item.item.image }}
            />
            <View style={{ flex: 1, justifyContent: "center", marginLeft: 5 }}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                {item.item.name}
              </Text>
              <Text style={{ color: "#666", fontSize: 12 }}>
                {item.item.description}
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                {dateFormatted}
              </Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                marginRight: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
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
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ paddingTop: 2 }}>
      {data && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    marginVertical: 100,
  },
});

export default index;
