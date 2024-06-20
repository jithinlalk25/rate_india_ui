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
            <FontAwesome size={28} name="list-alt" color={color} />
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
