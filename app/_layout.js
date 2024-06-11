import { Slot } from "expo-router";
import { SessionProvider } from "../ctx";
import { PaperProvider } from "react-native-paper";

export default function Root() {
  return (
    <SessionProvider>
      <PaperProvider>
        <Slot />
      </PaperProvider>
    </SessionProvider>
  );
}
