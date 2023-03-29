import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

export const manager = new BleManager();

const TARGET_ADDRESS = 'EC1FF10F-D43D-3B21-9D77-D6CBC851E5EC';

const scanAndConnect = async () => {
  manager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      // Handle error (scanning will be stopped automatically)
      return;
    }

    // Check if it is a device you are looking for based on advertisement data
    // or other criteria.
    // if (device?.name === 'TI BLE Sensor Tag' || device?.name === 'SensorTag') {
    if (device?.id === TARGET_ADDRESS) {
      // Stop scanning as it's not necessary if you are scanning for one device.
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

            for (const characteristic of characteristics) {
              if (characteristic.isWritableWithResponse) {
                await dev.writeCharacteristicWithResponseForService(
                  service.uuid,
                  characteristic.uuid,
                  '/gEABiABAAABAA==',
                );
              }
            }


          }
        })
        .catch(_error => {
          // Handle errors
        });
    }
  });
};

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const subscription = manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        scanAndConnect();
        subscription.remove();
      }
    }, true);
    return () => subscription.remove();
  }, [manager]);

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

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
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
