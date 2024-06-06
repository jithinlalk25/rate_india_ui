import { Slot } from "expo-router";
import { SessionProvider } from "../ctx";
import { PaperProvider } from "react-native-paper";

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <PaperProvider>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </PaperProvider>
  );
}
