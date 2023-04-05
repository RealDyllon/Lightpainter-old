import React, { useEffect } from 'react';
import { BleManager } from 'react-native-ble-plx';
import LightControl from './src/views/LightControl';
import { scanAndConnect } from './src/utils/scanAndConnect';

export const manager = new BleManager();

function App(): JSX.Element {
  useEffect(() => {
    const subscription = manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        scanAndConnect().then(_r => {});
        subscription.remove();
      }
    }, true);
    return () => subscription.remove();
  }, []);

  return <LightControl />;
}

export default App;
