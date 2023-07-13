import { Base64 } from "react-native-ble-plx";

export enum LightModes {
  Rainbow = "Rainbow",
  WarmWhite = "WarmWhite",
  CustomColor = "CustomColor",
}

export const LightModesCodes: Record<LightModes, Base64> = {
  [LightModes.Rainbow]: "/gEABiABAAAAAA==",
  [LightModes.WarmWhite]: "/gEABiABAAABAA==",
  [LightModes.CustomColor]: "/gEABiABAA3d0A==", //  todo: change this to match color picker state
};
