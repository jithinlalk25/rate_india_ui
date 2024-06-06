import { FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Avatar, Card, Text } from "react-native-paper";
import { useSession } from "../../../ctx";
import axios from "axios";
import { Constant } from "../../../constants";
import { router } from "expo-router";

const index = () => {
  // const [data, setData] = useState(null);
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
      // setData(response.data);

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

  // const getItems = async () => {
  //   console.log("+++++++++++", session);
  //   try {
  //     const response = await axios.post(
  //       `${Constant.API_URL}item/getItems`,
  //       {},
  //       {
  //         headers: {
  //           token: session,
  //         },
  //       }
  //     );
  //     setData(response.data);
  //     // console.log(response.data, typeof response.data);
  //     // return response.data;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  //on first fetch data.
  // useEffect(() => {
  //   getItems();
  // }, []);

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

  // return <View></View>;
  const renderItem = ({ item, index }) => {
    return (
      <Card
        onPress={() => router.navigate(`/item/${item._id}`)}
        style={{ marginLeft: 5, marginRight: 5, marginBottom: 5 }}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Avatar.Image
            style={{ margin: 5 }}
            size={100}
            source={{ uri: item.image }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {item.name}
            </Text>
            <Text> {item.description} </Text>
          </View>
          <View style={{ margin: 15 }}>
            <Avatar.Text
              size={80}
              label={item.rating}
              color="#000000"
              style={{ backgroundColor: "#FDCC0D" }}
            />
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={{ paddingTop: 5 }}>
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
    marginVertical: 20,
  },
});

export default index;
