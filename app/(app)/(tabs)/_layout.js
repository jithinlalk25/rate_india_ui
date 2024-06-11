import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, Tabs } from "expo-router";
import { Avatar, Button, IconButton } from "react-native-paper";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Rate India",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="list-alt" color={color} />
          ),
          headerRight: () => (
            <IconButton
              icon="account-circle"
              iconColor="#000000"
              size={35}
              onPress={() => router.navigate(`/userProfile`)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="myRatings"
        options={{
          title: "My Ratings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="star" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
