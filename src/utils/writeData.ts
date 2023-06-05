import { Base64, DeviceId } from "react-native-ble-plx";
import { manager } from "../../App";
import { TARGET_ADDRESS_1 } from "../constants/uuids";

export const writeData = async (deviceIds: DeviceId[], data: Base64) => {
  // console.log('devices', await manager.devices([TARGET_ADDRESS]));
  // console.log(
  //   'connected devices',
  //   await manager.connectedDevices([TARGET_ADDRESS]),
  // );

  console.log("writing data: ", data);

  await manager.devices(deviceIds).then((devices) => {
    devices.forEach((device) => {
      device
        .connect()
        .then((dev) => {
          return dev.discoverAllServicesAndCharacteristics();
        })
        .then(async (dev) => {
          // Do work on device with services and characteristics
          console.log("writing data");

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
                  data
                );
              }
            }
          }
        });
    });
  });
};
