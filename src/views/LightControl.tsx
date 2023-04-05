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
import { Appbar, SegmentedButtons } from "react-native-paper";
import { Slider } from "@miblanchard/react-native-slider";
import React, { useState } from "react";
import { LightModes, LightModesCodes } from "../constants/codes";
import { writeData } from "../utils/writeData";

var Buffer = require("@craftzdog/react-native-buffer").Buffer;

const backgroundStyle: StyleProp<ViewStyle> = {
  backgroundColor: "#ffffff", // isDarkMode ? Colors.darker : Colors.lighter,
  flex: 1,
};

const LightControl = () => {
  // const isDarkMode = useColorScheme() === 'dark';

  const [lightMode, setLightMode] = useState<LightModes>(LightModes.Multicolor);
  const [brightness, setBrightness] = useState(20);

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
          <Text style={[styles.sectionHeader, { marginTop: 0 }]}>
            Light Mode
          </Text>
          <SegmentedButtons
            value={lightMode}
            onValueChange={handleLightModeChange}
            buttons={Object.keys(LightModes).map((key) => ({
              value: key,
              label: key,
            }))}
            style={{
              paddingHorizontal: 20,
            }}
          />
          <Text style={styles.sectionHeader}>Brightness</Text>
          <View style={{ paddingHorizontal: 20 }}>
            <Slider
              value={brightness}
              minimumValue={0}
              maximumValue={100}
              step={1}
              onSlidingComplete={handleBrightnessChange}
              // onValueChange={handleBrightnessChange}
              trackStyle={{
                height: 20,
                borderRadius: 99,
              }}
              minimumTrackStyle={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                backgroundColor: "#cccccc",
              }}
              renderThumbComponent={() => (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 99,
                    backgroundColor: "black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                  >
                    {brightness}
                  </Text>
                </View>
              )}
            />
          </View>
          <Text style={styles.sectionHeader}>Color</Text>
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
