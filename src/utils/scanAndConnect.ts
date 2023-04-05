import { manager } from "../../App";
import { TARGET_ADDRESS } from "../constants/uuids";

export const scanAndConnect = async () => {
  console.log("scanAndConnect() executing");
  console.log("scanAndConnect() executing");
  await manager.startDeviceScan(null, null, (error, device) => {
    console.log("starting DeviceScan");
    if (error) {
      // Handle error (scanning will be stopped automatically)
      console.log("error");
      console.log(error);
      return;
    }

    console.log("device", `${device?.id}  ${device?.name}`);
    // Check if it is a device you are looking for based on advertisement data
    // or other criteria.
    // if (device?.name === 'TI BLE Sensor Tag' || device?.name === 'SensorTag') {
    if (device?.id === TARGET_ADDRESS) {
      // Stop scanning as it's not necessary if you are scanning for one device.
      console.log("found device - stopping scan");
      manager.stopDeviceScan();

      // Proceed with connection.
      device
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

            // for (const characteristic of characteristics) {
            //   if (characteristic.isWritableWithResponse) {
            //     await dev.writeCharacteristicWithResponseForService(
            //       service.uuid,
            //       characteristic.uuid,
            //       '/gEABiABAAABAA==',
            //     );
            //   }
            // }
          }
        })
        .catch((_error) => {
          // Handle errors
          console.log("caught errors");
          console.log(_error);
        });
    } else {
      console.log("device not found");
    }
  });
};
