import { writeData } from "./writeData";
import { DeviceId } from "react-native-ble-plx";
import { LightModes, LightModesCodes } from "../constants/codes";

export const writeSetPowerState = async (
  deviceIds: DeviceId[],
  newState: boolean,
  lightMode?: LightModes
) => {
  if (newState) {
    // await writeData(deviceIds, LightModesCodes[lightMode as LightModes]); // if (lightMode === LightModes.CustomColor) {
    await writeData(deviceIds, "/gEAAwABAQ=="); // switch on to warm white
  } else {
    await writeData(deviceIds, "/gEAAwABAA=="); //  switch off
  }
};
