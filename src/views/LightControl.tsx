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
import { Appbar, SegmentedButtons, Switch } from "react-native-paper";
import React, { useEffect, useState } from "react";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
} from "react-native-reanimated";

import { LightModes, LightModesCodes } from "../constants/codes";
import { writeData } from "../utils/writeData";
import ColorWheel from "../components/ColorWheel";
import BrightnessSlider from "../components/BrightnessSlider";
import { delay } from "../utils/delay";
import StrobeSlider from "../components/StrobeSlider";

var Buffer = require("@craftzdog/react-native-buffer").Buffer;

const backgroundStyle: StyleProp<ViewStyle> = {
  backgroundColor: "#ffffff", // isDarkMode ? Colors.darker : Colors.lighter,
  flex: 1,
};

const LightControl = () => {
  // const isDarkMode = useColorScheme() === 'dark';

  const [powerState, setPowerState] = useState(true);
  const [lightMode, setLightMode] = useState<LightModes>(LightModes.Multicolor);
  const [brightness, setBrightness] = useState(20);
  const [strobeFreq, setStrobeFreq] = useState(0);

  const colorWheelAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: lightMode === LightModes.CustomColor ? 1 : 0,
    };
  });

  const handlePowerStateChange = async (newValue: boolean) => {
    setPowerState(newValue);
    if (newValue) {
      writeData("/gEAAwABAQ==");
    } else {
      writeData("/gEAAwABAA==");
    }
  };

  const handleLightModeChange = (value: string) => {
    setLightMode(value as LightModes);
    writeData(LightModesCodes[value as LightModes]);
  };

  const handleBrightnessChange = async (value: number[]) => {
    console.log("value", value);
    setBrightness(value[0]);
    const hexValue = value[0].toString(16).padStart(2, "0");
    console.log("hexValue", hexValue);
    const encodedValue = Buffer.from(hexValue, "hex").toString("base64");
    console.log("encoded value", encodedValue);
    const payload = "/gEAAxAC" + encodedValue;
    console.log("payload", payload);
    await writeData(payload);
  };

  const handleStrobeFreqChange = async (value: number[]) => {
    setStrobeFreq(value[0]);
  };

  useEffect(() => {
    if (strobeFreq === 0) {
      return;
    }
    const interval = setInterval(() => {
      if (strobeFreq === 0) {
        return;
      }
      writeData("/gEAAwABAA==");
      delay((strobeFreq / 2) * 1000);
      writeData("/gEAAwABAQ==");
    }, strobeFreq * 1000);

    return () => clearInterval(interval);
  }, [strobeFreq]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={"dark-content"} // isDarkMode ? 'light-content' : 'dark-content'
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Appbar>
        <Appbar.Content title="Lightpainter" />
      </Appbar>
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
              value={powerState}
              onValueChange={handlePowerStateChange}
              style={{ marginRight: 20, marginTop: 20 }}
            />
          </View>
          <SegmentedButtons
            value={lightMode}
            onValueChange={handleLightModeChange}
            buttons={Object.keys(LightModes).map((key) => ({
              value: key,
              label: key,
              // showSelectedCheck: true,
            }))}
            style={{
              paddingHorizontal: 20,
            }}
          />
          <Text style={styles.sectionHeader}>Brightness</Text>
          <BrightnessSlider
            brightness={brightness}
            handleBrightnessChange={handleBrightnessChange}
          />
          <Text style={styles.sectionHeader}>Strobe Frequency</Text>
          <StrobeSlider
            frequency={strobeFreq}
            handleFrequencyChange={handleStrobeFreqChange}
          />
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={colorWheelAnimationStyle}
          >
            {lightMode === LightModes.CustomColor && (
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
};

export default LightControl;

const styles = StyleSheet.create({
  sectionHeader: {
    padding: 20,
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 20,
  },
});
