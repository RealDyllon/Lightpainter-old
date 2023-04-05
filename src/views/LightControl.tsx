import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Appbar, SegmentedButtons } from "react-native-paper";
import { Slider } from "@miblanchard/react-native-slider";
import { btoa } from "react-native-quick-base64";
import React, { useState } from "react";
import { LightModes, LightModesCodes } from "../constants/codes";
import { writeData } from "../utils/writeData";

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
        {/*<Header />*/}
        <View
        // style={{
        //   backgroundColor: isDarkMode ? Colors.black : Colors.white,
        // }}
        >
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
          <Text
            style={{
              paddingHorizontal: 20,
            }}
          >
            Brightness: {brightness}
          </Text>
          <View style={{ padding: 20 }}>
            <Slider
              value={brightness}
              minimumValue={0}
              maximumValue={100}
              step={1}
              onSlidingComplete={async (value) => {
                console.log("value", value);
                setBrightness(value[0]);
                const hexValue = value[0].toString(16).padStart(2, "0");
                console.log("hexValue", hexValue);
                const encodedValue = btoa(hexValue);
                console.log("encoded value", encodedValue);
                const payload = "/gEAAxAC" + encodedValue;
                console.log("payload", payload);
                await writeData(payload);
              }}
              trackStyle={{
                height: 20,
                borderRadius: 99,
              }}
              minimumTrackStyle={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                backgroundColor: "#cccccc",
              }}
              thumbStyle={{
                width: 30,
                height: 30,
                borderRadius: 99,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LightControl;
