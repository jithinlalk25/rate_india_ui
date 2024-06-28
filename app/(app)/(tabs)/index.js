import { FlatList, Linking, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Avatar,
  Banner,
  Button,
  Card,
  Dialog,
  IconButton,
  Portal,
  Searchbar,
  Text,
  TextInput,
} from "react-native-paper";
import { useSession } from "../../../ctx";
import axios from "axios";
import { Constant } from "../../../constants";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { Rating } from "@kolking/react-native-rating";
import AsyncStorage from "@react-native-async-storage/async-storage";

const index = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <IconButton
            icon="alert-octagon"
            iconColor="darkblue"
            size={35}
            onPress={() => setDialogVisible(true)}
          />
          <IconButton
            icon="account-circle"
            iconColor="#000000"
            size={35}
            onPress={() => router.navigate(`/userProfile`)}
          />
        </View>
      ),
    });
  }, []);

  const { session, signOut } = useSession();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [userDataAvailable, setUserDataAvailable] = useState(null);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const getUser = async () => {
    try {
      const response = await axios.get(`${Constant.API_URL}user`, {
        headers: {
          token: session,
        },
      });
      if (response.data.username) {
        setUserDataAvailable(true);
      } else {
        setUserDataAvailable(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const updateUserData = async () => {
    try {
      const response = await axios.post(
        `${Constant.API_URL}user/updateUserData`,
        {
          username,
        },
        {
          headers: {
            token: session,
          },
        }
      );
      setUserDataAvailable(true);
    } catch (error) {
      console.error(error);
      if (error.response.status == 409) {
        setUsernameError("Username already exist");
      }
    }
  };

  const getStorageData = async () => {
    try {
      const value = await AsyncStorage.getItem("bannerVisible");
      if (value == "false") {
        setBannerVisible(false);
      } else {
        setBannerVisible(true);
      }

      const dialogVisible = await AsyncStorage.getItem("dialogVisible");
      if (dialogVisible != "false") {
        setDialogVisible(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const hideDialog = async () => {
    await AsyncStorage.setItem("dialogVisible", "false");
    setDialogVisible(false);
  };

  const setStorageData = async () => {
    try {
      await AsyncStorage.setItem("bannerVisible", "false");
      setBannerVisible(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getStorageData();
  }, []);

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
      if (error.response.status == 401) {
        signOut();
      }
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
      if (error.response.status == 401) {
        signOut();
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => {
        setData([]);
        setPage(1);
        setLoading(false);
        setHasMore(true);
      };
    }, [])
  );

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
    if (rating > 0) {
      return "#ff4545";
    }
    return "gray";
  };

  const renderItem = ({ item, index }) => {
    return (
      <Card
        onPress={() => router.navigate(`/item/${item._id}`)}
        style={{
          backgroundColor: "white",
          marginLeft: 5,
          marginRight: 5,
          marginBottom: 5,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            padding: 5,
          }}
        >
          <Avatar.Image
            style={{ margin: 2 }}
            size={66}
            source={{ uri: item.image }}
          />
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              marginLeft: 5,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {item.name}
            </Text>
            <Text
              style={{ fontSize: 12, color: "#00008B", fontWeight: "bold" }}
            >
              {item.description}
            </Text>
            <Rating
              style={{ marginTop: 3 }}
              size={20}
              rating={item.rating}
              disabled={true}
              fillColor="gold"
              baseColor="lightgray"
              spacing={3}
            />
          </View>
          <View
            style={{ justifyContent: "center", marginLeft: 5, marginRight: 5 }}
          >
            <View
              style={{
                borderWidth: 3,
                width: 45,
                height: 45,
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

  if (userDataAvailable == null) {
    return;
  }

  if (userDataAvailable == false) {
    return (
      <Portal>
        <Dialog visible={true} dismissable={false}>
          <Dialog.Title style={{ ...styles.title, alignSelf: "center" }}>
            Add your username
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              style={{ margin: 10, width: 200, alignSelf: "center" }}
              label="Username"
              value={username}
              error={usernameError}
              onChangeText={(data) => {
                const allowedPattern = /^[a-zA-Z0-9_.-]{0,30}$/;
                if (allowedPattern.test(data)) {
                  setUsername(data);
                  setUsernameError("");
                }
              }}
              maxLength={30}
            />
            {usernameError ? (
              <Text
                style={{
                  color: "red",
                  marginTop: 8,
                  alignSelf: "center",
                }}
              >
                {usernameError}
              </Text>
            ) : null}
            <Text>
              • Minimum length is 3{"\n"}• Allowed characters - alphabets,
              numbers, _, -, .
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button disabled={username.length < 3} onPress={updateUserData}>
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }

  return (
    <View style={{ paddingBottom: 80 }}>
      <Portal>
        <Dialog visible={dialogVisible} dismissable={false}>
          <Dialog.Title style={styles.title}>Disclaimer</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              This app does not represent any government entity. The information
              provided is sourced from the websites given below. It is not
              officially endorsed or authorized. {"\n\n"}•{" "}
              <Text
                style={{ color: "blue", textDecorationLine: "underline" }}
                onPress={() =>
                  Linking.openURL(
                    "http://www.niyamasabha.org/codes/members.htm"
                  )
                }
              >
                http://www.niyamasabha.org/codes/members.htm
              </Text>
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Okay</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {bannerVisible != null && (
        <Banner
          visible={bannerVisible}
          actions={[
            {
              label: "Okay",
              onPress: () => setStorageData(),
            },
          ]}
        >
          Currently members of KERALA LEGISLATIVE ASSEMBLY is listed. Will be
          adding all public figures in India soon.
        </Banner>
      )}
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
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default index;
