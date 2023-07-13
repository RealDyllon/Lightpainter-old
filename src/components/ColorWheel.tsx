import React from "react";
import { StyleSheet, View } from "react-native";

var Buffer = require("@craftzdog/react-native-buffer").Buffer;

import ColorPicker, {
  Panel3,
  // Swatches,
  // Preview,
  // OpacitySlider,
  // HueSlider,
  returnedResults,
} from "reanimated-color-picker";
import { writeData } from "../utils/writeData";
import { TARGET_ADDRESS_1 } from "../constants/uuids";

const ColorWheel = () => {
  const onSelectColor = async ({ hex }: returnedResults) => {
    // do something with the selected color.
    console.log(hex);
    const hexValue = hex.substring(1).concat("00");
    console.log("hexValue", hexValue);
    const encodedValue = Buffer.from(hexValue, "hex").toString("base64");
    const payload = "/gEABiAB" + encodedValue;
    console.log("payload", payload);
    await writeData([TARGET_ADDRESS_1], payload);
  };

  return (
    <View style={styles.container}>
      <ColorPicker
        style={{ width: "70%" }}
        value="red"
        onComplete={onSelectColor}
      >
        {/*<Preview />*/}
        <Panel3 />
        {/*<HueSlider />*/}
        {/*<OpacitySlider />*/}
        {/*<Swatches />*/}
      </ColorPicker>
    </View>
  );
};

export default ColorWheel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
