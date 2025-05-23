import { Redirect, Stack } from "expo-router";

import { useSession } from "../../ctx";
import { Text } from "react-native";

export default function AppLayout() {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerTitle: "Rate India", headerShown: false }}
      />
      <Stack.Screen name="item/[id]" />
      <Stack.Screen name="userProfile" options={{ headerTitle: "Profile" }} />
    </Stack>
  );
}
