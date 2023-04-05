import { Base64 } from "react-native-ble-plx";

export enum LightModes {
  Multicolor = "Multicolor",
  WarmWhite = "WarmWhite",
  StaticColor = "StaticColor",
}

export const LightModesCodes: Record<LightModes, Base64> = {
  [LightModes.Multicolor]: "/gEABiABAAAAAA==",
  [LightModes.WarmWhite]: "/gEABiABAAABAA==",
  [LightModes.StaticColor]: "/gEABiABAA3d0A==", //  todo: change this to match color picker state
};
