import { FlatList, ImageBackground, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Avatar,
  Card,
  Searchbar,
  Text,
} from "react-native-paper";
import { useSession } from "../../../ctx";
import axios from "axios";
import { Constant } from "../../../constants";
import { router } from "expo-router";
import { AirbnbRating } from "react-native-ratings";

const index = () => {
  const { session } = useSession();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchData = async (text) => {
    setSearchQuery(text);
    text = text.trim();
    if (text.length < 3) {
      return;
    }

    setSearchLoading(true);

    try {
      const response = await axios.post(
        `${Constant.API_URL}item/searchItems`,
        { text },
        {
          headers: {
            token: session,
          },
        }
      );

      setsearchResult(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchData = async (pageNumber = 1) => {
    if (loading || !hasMore) return;

    setLoading(true);

    const params = data.length > 0 ? { order: data.at(-1).order } : {};

    try {
      const response = await axios.post(
        `${Constant.API_URL}item/getItems`,
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchData(page + 1);
    }
  };

  const renderFooter = () => {
    return loading ? <ActivityIndicator style={styles.loader} /> : null;
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
    return "#ff4545";
  };

  const renderItem = ({ item, index }) => {
    return (
      <Card
        onPress={() => router.navigate(`/item/${item._id}`)}
        style={{
          backgroundColor: "white",
          marginLeft: 10,
          marginRight: 10,
          marginBottom: 10,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row", padding: 10 }}>
          <Avatar.Image
            style={{ margin: 5 }}
            size={80}
            source={{ uri: item.image }}
          />
          <View style={{ flex: 1, justifyContent: "center", marginLeft: 5 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {item.name}
            </Text>
            <Text style={{ color: "#666" }}> {item.description} </Text>
            <View style={{ alignSelf: "flex-start" }}>
              <AirbnbRating
                count={5}
                defaultRating={item.rating}
                size={30}
                showRating={false}
                isDisabled={true}
              />
            </View>
          </View>
          <View style={{ justifyContent: "center" }}>
            <View
              style={{
                borderWidth: 5,
                width: 60,
                height: 60,
                borderRadius: 50,
                borderColor: ratingColor(item.rating),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.text}>{item.rating}</Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={{ backgroundColor: "#697177" }}>
      <Searchbar
        placeholder="Search"
        onChangeText={searchData}
        value={searchQuery}
        style={{ margin: 10 }}
      />
      {data && searchQuery.trim().length == 0 && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
      {searchResult && searchQuery.trim().length >= 3 && (
        <FlatList
          data={searchResult}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      )}
      {searchLoading && <ActivityIndicator style={styles.loader} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  loader: {
    marginVertical: 100,
  },

  text: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
  },
});

export default index;
