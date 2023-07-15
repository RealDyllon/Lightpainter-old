import { MZDS01_LED } from "./MZDS01_LED";
import { LightModes } from "../constants/codes";
import { LEDDevice } from "../context/devicesStore";

export enum Pattern {
  ONE_BY_ONE = "ONE_BY_ONE",
}

export class LEDGroup extends MZDS01_LED {
  private _devices: LEDDevice[] = [];
  private _isPattern: boolean = false;
  private pattern: Pattern | null = null;

  constructor(
    deviceId: string,
    deviceName: string,
    isOn: boolean,
    LightMode: LightModes,
    color: string
  ) {
    super(deviceId, deviceName, isOn, LightMode, color);
  }

  public get devices(): LEDDevice[] {
    return this._devices;
  }

  public set devices(value: LEDDevice[]) {
    this._devices = value;
  }

  public addDevice(device: LEDDevice) {
    // ensure device is not already in the list
    if (!this._devices.find((d) => d.deviceId === device.deviceId)) {
      this._devices.push(device);
    }
  }

  public removeDevice(device: LEDDevice) {
    this._devices = this._devices.filter((d) => d.deviceId !== device.deviceId);
  }

  public get isOn(): boolean {
    return super.isOn;
  }

  // extend set isOn
  public set isOn(value: boolean) {
    // write WarmWhite or Off
    for (const device of this._devices) {
      device.isOn = value;
    }
    super.isOn = value;
  }

  public set isPattern(value: boolean) {
    this._isPattern = value;
  }

  public get isPattern(): boolean {
    return this._isPattern;
  }

  public set Pattern(pattern: Pattern | null) {
    this.pattern = pattern;
  }

  public get Pattern(): Pattern | null {
    return this.pattern;
  }
}
