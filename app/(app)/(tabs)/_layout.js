import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Rate India",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="users" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: "News",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="newspaper-o" color={color} />
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
