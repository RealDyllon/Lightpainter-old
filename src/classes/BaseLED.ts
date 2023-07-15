export class BaseLED {
  protected _deviceId: string;
  protected _deviceName: string;
  private _isOn: boolean;

  constructor(deviceId: string, deviceName: string, isOn: boolean) {
    this._deviceId = deviceId;
    this._deviceName = deviceName;
    this._isOn = isOn;
  }

  public get deviceId(): string {
    return this._deviceId;
  }

  public set deviceId(value: string) {
    this._deviceId = value;
  }

  public get deviceName(): string {
    return this._deviceName;
  }

  public set deviceName(value: string) {
    this._deviceName = value;
  }

  public get isOn(): boolean {
    return this._isOn;
  }

  public set isOn(value: boolean) {
    this._isOn = value;
  }
}
