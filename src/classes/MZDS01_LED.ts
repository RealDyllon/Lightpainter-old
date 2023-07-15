import { writeData } from "../utils/writeData";
import { BaseLED } from "./BaseLED";
import { LightModes } from "../constants/codes";

var Buffer = require("@craftzdog/react-native-buffer").Buffer;

const MZDS01_LED_Codes = {
  lightMode: {
    [LightModes.Rainbow]: "/gEABiABAAAAAA==",
    [LightModes.WarmWhite]: "/gEABiABAAABAA==",
    [LightModes.CustomColor]: "/gEABiABAA3d0A==", //  todo: change this to match color picker state
  },
  power: {
    on: "/gEAAwABAQ==",
    off: "/gEAAwABAA==",
  },
};

export class MZDS01_LED extends BaseLED {
  private _lightMode: LightModes = LightModes.WarmWhite; // default color
  private _color: string = "#ff0000"; // default color
  private _brightness: number = 100; // default brightness
  private _strobing: boolean = false; // default strobing
  private _strobeFreq: number = 100; // default strobe speed

  constructor(
    deviceId: string,
    deviceName: string,
    isOn: boolean,
    LightMode: LightModes,
    color: string
  ) {
    super(deviceId, deviceName, isOn);
    this._lightMode = LightMode;
    this._color = color;
    // console.log('MZDS01_LED constructor');
  }

  public get isOn(): boolean {
    return super.isOn;
  }

  // extend set isOn
  public set isOn(value: boolean) {
    // write WarmWhite or Off
    // todo: change string literal to MZDS01_LED_Codes
    super.isOn = value;
    writeData([this._deviceId], value ? "/gEAAwABAQ==" : "/gEAAwABAA==").then(
      () => {}
    );
  }

  public get lightMode(): LightModes {
    return this._lightMode;
  }

  public set lightMode(value: LightModes) {
    // write to LED
    writeData(
      [this._deviceId],
      MZDS01_LED_Codes.lightMode[value as LightModes]
    ).then(() => {});

    this._lightMode = value;
  }

  public get color(): string {
    if (this._lightMode === LightModes.Rainbow) {
      return this._color;
    } else {
      throw new Error(
        `Get Color is not available in color mode: ${this._lightMode}`
      );
    }
  }

  public set color(value: string) {
    if (this._lightMode === LightModes.Rainbow) {
      // write to LED
      // wait for success response
    } else {
      throw new Error(
        `Set Color is not available in color mode: ${this._lightMode}`
      );
    }
  }

  public get brightness(): number {
    return this._brightness;
  }

  public set brightness(value: number) {
    this._brightness = value;

    // write to LED
    console.log("value", value);
    const hexValue = value.toString(16).padStart(2, "0");
    console.log("hexValue", hexValue);
    const encodedValue = Buffer.from(hexValue, "hex").toString("base64");
    console.log("encoded value", encodedValue);
    const payload = "/gEAAxAC" + encodedValue;
    console.log("payload", payload);

    writeData([this._deviceId], payload).then(() => {});
  }

  public get strobing(): boolean {
    return this._strobing;
  }

  public set strobing(value: boolean) {
    this._strobing = value;
  }

  public get strobeFreq(): number {
    return this._strobeFreq;
  }

  public set strobeFreq(value: number) {
    this._strobeFreq = value;
  }
}
