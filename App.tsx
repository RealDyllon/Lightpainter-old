import React, { useEffect } from "react";
import { BleManager, DeviceId, State } from "react-native-ble-plx";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/views/Home";
import LightControl from "./src/views/LightControl";
import { scanAndConnect } from "./src/utils/scanAndConnect";

export const manager = new BleManager();

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Home: undefined;
  LightControl: {
    deviceId?: DeviceId;
    isGroupControl?: boolean;
    screenTitle?: string;
  };
};

function App(): JSX.Element {
  const managerState = manager.state();

  useEffect(() => {
    const subscription = manager.onStateChange((state) => {
      if (state === State.PoweredOn) {
        scanAndConnect().then((_r) => {});
        subscription.remove();
      }
    }, true);
    return () => subscription.remove();
  }, [managerState]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="LightControl"
          component={LightControl}
          options={({ route }) => ({ title: route.params.screenTitle })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
