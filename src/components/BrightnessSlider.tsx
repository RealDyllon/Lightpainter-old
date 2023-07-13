import { Slider } from "@miblanchard/react-native-slider";
import { Text, View } from "react-native";
import React from "react";

interface BrightnessSliderProps {
  brightness: number;
  handleBrightnessChange: (value: number[]) => void;
}

const BrightnessSlider = ({
  brightness,
  handleBrightnessChange,
}: BrightnessSliderProps) => {
  return (
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
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              {brightness}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default BrightnessSlider;
