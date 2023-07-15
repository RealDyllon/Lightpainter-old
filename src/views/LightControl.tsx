import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { SegmentedButtons, Switch } from "react-native-paper";
import React, { useEffect, useMemo } from "react";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
} from "react-native-reanimated";

import { LightModes } from "../constants/codes";
import ColorWheel from "../components/ColorWheel";
import BrightnessSlider from "../components/BrightnessSlider";
import StrobeSlider from "../components/StrobeSlider";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import {
  ActionType,
  LEDDevice,
  useDevicesContext,
} from "../context/devicesStore";
// import { useLightContext } from "../context/lightStore";

const backgroundStyle: StyleProp<ViewStyle> = {
  backgroundColor: "#ffffff", // isDarkMode ? Colors.darker : Colors.lighter,
  flex: 1,
};

type LightControlProps = NativeStackScreenProps<
  RootStackParamList,
  "LightControl"
>;

function LightControl({ route }: LightControlProps) {
  // const isDarkMode = useColorScheme() === 'dark';

  const { state, dispatch } = useDevicesContext();

  const lights = state.devices;

  const { deviceId, isGroupControl } = route.params;

  // if its a group, treat is like a single virtual device

  const light: LEDDevice = useMemo(() => {
    if (isGroupControl) {
      return state.group;
    }
    const targetLight = lights.find((l) => l.deviceId === deviceId);
    if (!targetLight) {
      throw new Error("Light not found");
    }
    return targetLight;
  }, [deviceId, isGroupControl, lights, state.group]);

  // TODO: add better check for if this is group control
  // const deviceIds = useMemo(() => {
  //   return deviceId
  //     ? [deviceId]
  //     : lights.filter((light) => light.grouped).map((light) => light.deviceId);
  // }, [deviceId, lights]);

  // const [powerState, setPowerState] = useState(true);
  // const [lightMode, setLightMode] = useState<LightModes>(LightModes.Rainbow);
  // const [brightness, setBrightness] = useState(20);
  // const [strobeFreq, setStrobeFreq] = useState(0);

  const colorWheelAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: light.lightMode === LightModes.CustomColor ? 1 : 0,
    };
  });

  const handlePowerStateChange = async (value: boolean) => {
    // light.isOn = value;
    dispatch({
      type: ActionType.SET_ISON,
      payload: {
        deviceId: light.deviceId,
        isOn: value,
      },
    });
  };

  const handleLightModeChange = (value: string) => {
    // light.lightMode = value as LightModes;
    dispatch({
      type: ActionType.SET_LIGHTMODE,
      payload: {
        deviceId: light.deviceId,
        lightMode: value as LightModes,
      },
    });
  };

  const handleBrightnessChange = async (value: number[]) => {
    // light.brightness = value[0];
    dispatch({
      type: ActionType.SET_BRIGHTNESS,
      payload: {
        deviceId: light.deviceId,
        brightness: value[0],
      },
    });
  };

  const handleStrobeFreqChange = async (value: number[]) => {
    // light.strobeFreq = value[0];
    dispatch({
      type: ActionType.SET_STROBE_FREQ,
      payload: {
        deviceId: light.deviceId,
        strobeFreq: value[0],
      },
    });
  };

  useEffect(() => {
    if (light.strobeFreq === 0) {
      return;
    }
    const interval = setInterval(async () => {
      if (light.strobeFreq === 0) {
        return;
      }
      // deviceIds.map(async (deviceId) => {
      //   await writeData([deviceId], "/gEAAwABAA==");
      //   await delay((strobeFreq / 2) * 1000);
      //   await writeData([deviceId], "/gEAAwABAQ==");
      // });
    }, light.strobeFreq * 1000);

    return () => clearInterval(interval);
  }, [light, light.strobeFreq]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={"dark-content"} // isDarkMode ? 'light-content' : 'dark-content'
        // backgroundColor={backgroundStyle.backgroundColor}
      />
      {/*<Appbar>*/}
      {/*  <Appbar.Content title="Lightpainter" />*/}
      {/*</Appbar>*/}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.sectionHeader, { marginTop: 0 }]}>
              Light Mode
            </Text>
            <View style={{ flex: 1 }} />
            <Switch
              value={light.isOn}
              onValueChange={handlePowerStateChange}
              style={{ marginRight: 20, marginTop: 20 }}
            />
          </View>
          <SegmentedButtons
            value={light.lightMode}
            onValueChange={handleLightModeChange}
            // buttons={Object.keys(LightModes).map((key) => ({
            //   value: key,
            //   label: key,
            //   // showSelectedCheck: true,
            // }))}
            buttons={[
              { value: "WarmWhite", label: "Warm White" },
              { value: "Rainbow", label: "Rainbow" },
              { value: "CustomColor", label: "Custom Color" },
            ]}
            style={{
              paddingHorizontal: 20,
            }}
          />
          <Text style={styles.sectionHeader}>Brightness</Text>
          <BrightnessSlider
            brightness={light.brightness}
            handleBrightnessChange={handleBrightnessChange}
          />
          <Text style={styles.sectionHeader}>Strobe Frequency</Text>
          <StrobeSlider
            frequency={light.strobeFreq}
            handleFrequencyChange={handleStrobeFreqChange}
          />
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={colorWheelAnimationStyle}
          >
            {light.lightMode === LightModes.CustomColor && (
              <>
                <Text style={styles.sectionHeader}>Color</Text>
                <ColorWheel />
              </>
            )}
          </Animated.View>
          <View />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default LightControl;

const styles = StyleSheet.create({
  sectionHeader: {
    padding: 20,
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 20,
  },
});
