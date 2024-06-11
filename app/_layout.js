import { Slot } from "expo-router";
import { SessionProvider } from "../ctx";
import { DefaultTheme, PaperProvider } from "react-native-paper";

export default function Root() {
  return (
    <SessionProvider>
      <PaperProvider theme={DefaultTheme}>
        <Slot />
      </PaperProvider>
    </SessionProvider>
  );
}
