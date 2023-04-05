import { Base64 } from "react-native-ble-plx";

export enum LightModes {
  Multicolor = "Multicolor",
  WarmWhite = "WarmWhite",
  CustomColor = "CustomColor",
}

export const LightModesCodes: Record<LightModes, Base64> = {
  [LightModes.Multicolor]: "/gEABiABAAAAAA==",
  [LightModes.WarmWhite]: "/gEABiABAAABAA==",
  [LightModes.CustomColor]: "/gEABiABAA3d0A==", //  todo: change this to match color picker state
};
