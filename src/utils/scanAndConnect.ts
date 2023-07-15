import { MZDS01_LED } from "../classes/MZDS01_LED";
import { LightModes } from "../constants/codes";
import { BleManager } from "react-native-ble-plx";
import { ActionType, Dispatch } from "../context/devicesStore";

export const scanAndConnect = async (
  manager: BleManager,
  dispatch: Dispatch
) => {
  console.log("scanAndConnect() executing");
  console.log("scanAndConnect() executing");
  await manager.startDeviceScan(null, null, (error, device) => {
    // console.log("starting DeviceScan");
    if (error) {
      // Handle error (scanning will be stopped automatically)
      console.log("startDeviceScan error");
      console.log(error);
      return;
    }

    const today = new Date();
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log(time + "  device", `${device?.id}  ${device?.name}`);
    // Check if it is a device you are looking for based on advertisement data
    // or other criteria.
    // if (device?.name === 'TI BLE Sensor Tag' || device?.name === 'SensorTag') {
    // if (device?.id === TARGET_ADDRESS_1) {
    // if (TARGET_ADDRESSES.includes(device?.id ?? "")) {
    if (device?.name === "MZDS01") {
      // Stop scanning as it's not necessary if you are scanning for one device.

      console.log(`found device - ${device?.id} - ${device?.name}`);

      // console.log("found device - stopping scan");
      // manager.stopDeviceScan();

      // clear any existing connections
      device!.cancelConnection();

      // Proceed with connection.
      device!
        .connect()
        .then((dev) => {
          return dev.discoverAllServicesAndCharacteristics();
        })
        .then(async (dev) => {
          // Do work on device with services and characteristics
          console.log("writing to chars");

          const services = await dev.services();
          for (const service of services) {
            const characteristics = await dev.characteristicsForService(
              service.uuid
            );
            for (const characteristic of characteristics) {
              if (characteristic.isWritableWithResponse) {
                await dev.writeCharacteristicWithResponseForService(
                  service.uuid,
                  characteristic.uuid,
                  "/gEAAlAR"
                );
              }
            }

            for (const characteristic of characteristics) {
              if (characteristic.isWritableWithResponse) {
                await dev.writeCharacteristicWithResponseForService(
                  service.uuid,
                  characteristic.uuid,
                  "/gEAAjAE"
                );
              }
            }

            for (const characteristic of characteristics) {
              if (characteristic.isWritableWithResponse) {
                await dev.writeCharacteristicWithResponseForService(
                  service.uuid,
                  characteristic.uuid,
                  "/gEAEFAB" + "MjAyMzAzMjkxMjM0MjI="
                );
              }
            }
            for (const characteristic of characteristics) {
              if (characteristic.isWritableWithResponse) {
                await dev.writeCharacteristicWithResponseForService(
                  service.uuid,
                  characteristic.uuid,
                  "/gEABiABAAABAA=="
                );
              }
            }
          }

          // add to store

          const newLED = new MZDS01_LED(
            device.id,
            device.name ?? "Unnamed",
            true,
            LightModes.Rainbow,
            "#ff0000"
          );

          // add newLED to devicesStore
          dispatch({
            type: ActionType.ON_CONNECT,
            payload: newLED,
          });
        })
        .catch((_error) => {
          // Handle errors
          console.log("caught errors");
          console.log(_error);
        });
    } else {
      // console.log("device not found");
    }
  });
  // await manager.stopDeviceScan();
  // console.log("stopped scan");
};
