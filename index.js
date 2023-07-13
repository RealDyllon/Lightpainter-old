/**
 * @format
 */

import * as React from "react";
import { AppRegistry } from "react-native";
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import App from "./App";
import { name as appName } from "./app.json";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LightContextProvider } from "./src/context/lightStore";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // primary: 'tomato',
    // secondary: 'yellow',
  },
};

function AppWithProviders() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <LightContextProvider>
          <App />
        </LightContextProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent(appName, () => AppWithProviders);
