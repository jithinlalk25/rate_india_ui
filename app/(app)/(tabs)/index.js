import { FlatList, ImageBackground, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Avatar, Card, Text } from "react-native-paper";
import { useSession } from "../../../ctx";
import axios from "axios";
import { Constant } from "../../../constants";
import { router } from "expo-router";

const index = () => {
  const { session } = useSession();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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
          </View>
          <View style={{ justifyContent: "center" }}>
            <ImageBackground
              source={require("../../../assets/star.png")}
              style={{
                height: 80,
                width: 80,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={{ paddingTop: 5 }}>
                <Text style={styles.text}>{item.rating}</Text>
              </View>
            </ImageBackground>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={{ paddingTop: 10 }}>
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
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default index;
