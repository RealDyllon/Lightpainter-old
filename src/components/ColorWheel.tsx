import React from "react";
import { StyleSheet, View } from "react-native";

import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
  returnedResults,
} from "reanimated-color-picker";

const ColorWheel = () => {
  const onSelectColor = ({ hex }: returnedResults) => {
    // do something with the selected color.
    console.log(hex);
  };

  return (
    <View style={styles.container}>
      <ColorPicker
        style={{ width: "70%" }}
        value="red"
        onComplete={onSelectColor}
      >
        <Preview />
        <Panel1 />
        <HueSlider />
        <OpacitySlider />
        <Swatches />
      </ColorPicker>
    </View>
  );
};

export default ColorWheel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
