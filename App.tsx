import React, {useEffect} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import {Base64, BleManager} from 'react-native-ble-plx';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

export const manager = new BleManager();

// const TARGET_ADDRESS = 'EC1FF10F-D43D-3B21-9D77-D6CBC851E5EC';
const TARGET_ADDRESS = '5629ECE4-2A55-3E86-C132-3ACF6CE376FE';

const scanAndConnect = async () => {
  console.log('scanAndConnect() executing');
  console.log('scanAndConnect() executing');
  await manager.startDeviceScan(null, null, (error, device) => {
    console.log('starting DeviceScan');
    if (error) {
      // Handle error (scanning will be stopped automatically)
      console.log('error');
      console.log(error);
      return;
    }

    console.log('device', `${device?.id}  ${device?.name}`);
    // Check if it is a device you are looking for based on advertisement data
    // or other criteria.
    // if (device?.name === 'TI BLE Sensor Tag' || device?.name === 'SensorTag') {
    if (device?.id === TARGET_ADDRESS) {
      // Stop scanning as it's not necessary if you are scanning for one device.
      console.log('found device - stopping scan');
      manager.stopDeviceScan();

      // Proceed with connection.
      device
        .connect()
        .then(dev => {
          return dev.discoverAllServicesAndCharacteristics();
        })
        .then(async dev => {
          // Do work on device with services and characteristics
          console.log('writing to chars');

          const services = await dev.services();
          for (const service of services) {
            const characteristics = await dev.characteristicsForService(
              service.uuid,
            );

            for (const characteristic of characteristics) {
              if (characteristic.isWritableWithResponse) {
                await dev.writeCharacteristicWithResponseForService(
                  service.uuid,
                  characteristic.uuid,
                  '/gEAAlAR',
                );
              }
            }

            for (const characteristic of characteristics) {
              if (characteristic.isWritableWithResponse) {
                await dev.writeCharacteristicWithResponseForService(
                  service.uuid,
                  characteristic.uuid,
                  '/gEAAjAE',
                );
              }
            }

            for (const characteristic of characteristics) {
              if (characteristic.isWritableWithResponse) {
                await dev.writeCharacteristicWithResponseForService(
                  service.uuid,
                  characteristic.uuid,
                  '/gEAEFAB' + 'MjAyMzAzMjkxMjM0MjI=',
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
        .catch(_error => {
          // Handle errors
          console.log('caught errors');
          console.log(_error);
        });
    } else {
      console.log('device not found');
    }
  });
};

const writeData = async (data: Base64) => {
  console.log('devices', await manager.devices([TARGET_ADDRESS]));
  console.log(
    'connected devices',
    await manager.connectedDevices([TARGET_ADDRESS]),
  );
  await manager.devices([TARGET_ADDRESS]).then(devices => {
    devices.forEach(device => {
      device
        .connect()
        .then(dev => {
          return dev.discoverAllServicesAndCharacteristics();
        })
        .then(async dev => {
          // Do work on device with services and characteristics
          console.log('writing data');

          const services = await dev.services();
          for (const service of services) {
            const characteristics = await dev.characteristicsForService(
              service.uuid,
            );

            for (const characteristic of characteristics) {
              if (characteristic.isWritableWithResponse) {
                await dev.writeCharacteristicWithResponseForService(
                  service.uuid,
                  characteristic.uuid,
                  data,
                );
              }
            }
          }
        });
    });
  });
};

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // const [isSearching, setSearching] = useState(false);

  useEffect(() => {
    const subscription = manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        scanAndConnect();
        subscription.remove();
      }
    }, true);
    return () => subscription.remove();
  }, [manager]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button
            title="Warm White"
            onPress={() => writeData('/gEABiABAAABAA==')}
          />
          <Button
            title="Multicolor"
            onPress={() => writeData('/gEABiABAAAAAA==')}
          />
          <Button
            title="Light Blue"
            onPress={() => writeData('/gEABiABAA3d0A==')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
