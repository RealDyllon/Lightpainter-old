import React, { createContext, useContext, useReducer } from "react";
import { MZDS01_LED } from "../classes/MZDS01_LED";
import { LEDGroup } from "../classes/LEDGroup";
import { LightModes } from "../constants/codes";

// export type LEDDevice = BaseLED | MZDS01_LED | LEDGroup;
export type LEDDevice = MZDS01_LED | LEDGroup;

export enum ActionType {
  // ON EVENTS
  ON_CONNECT = "ON_CONNECT",
  ON_DISCONNECT = "ON_DISCONNECT",
  // MUTATE STATE
  SET_ISON = "SET_ISON",
  SET_LIGHTMODE = "SET_LIGHTMODE",
  SET_BRIGHTNESS = "SET_BRIGHTNESS",
  SET_STROBING = "SET_STROBING",
  SET_STROBE_FREQ = "SET_STROBE_FREQ",
  // GROUPS
  ADD_TO_GROUP = "ADD_TO_GROUP",
  REMOVE_FROM_GROUP = "REMOVE_FROM_GROUP",
  SET_GROUP_ISON = "SET_GROUP_ISON",
}

type Action =
  // on events
  | {
      type: ActionType.ON_CONNECT;
      payload: LEDDevice;
    }
  | {
      type: ActionType.ON_DISCONNECT;
    }
  // mutate state
  | {
      type: ActionType.SET_ISON;
      payload: {
        deviceId: string;
        isOn: boolean;
      };
    }
  | {
      type: ActionType.SET_LIGHTMODE;
      payload: {
        deviceId: string;
        lightMode: LightModes;
      };
    }
  | {
      type: ActionType.SET_BRIGHTNESS;
      payload: {
        deviceId: string;
        brightness: number;
      };
    }
  | {
      type: ActionType.SET_STROBING;
      payload: {
        deviceId: string;
        isStrobing: boolean;
      };
    }
  | {
      type: ActionType.SET_STROBE_FREQ;
      payload: {
        deviceId: string;
        strobeFreq: number;
      };
    }
  // groups
  | {
      type: ActionType.ADD_TO_GROUP;
      payload: {
        deviceId: string;
      };
    }
  | {
      type: ActionType.REMOVE_FROM_GROUP;
      payload: {
        deviceId: string;
      };
    }
  | {
      type: ActionType.SET_GROUP_ISON;
      payload: {
        isOn: boolean;
      };
    };

interface State {
  devices: Array<LEDDevice>;
  group: LEDGroup; // todo
}

const initialState: State = {
  devices: [],
  group: new LEDGroup("group", "Group", true, LightModes.WarmWhite, "#ff0000"),
};

type Context = {
  state: State;
  dispatch: React.Dispatch<any>;
};

export const DevicesContext = createContext<Context>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.ON_CONNECT:
      console.log("adding device to devicesStore");
      return {
        ...state,
        devices: [...state.devices, action.payload],
      };

    // case ActionType.ON_DISCONNECT:

    case ActionType.SET_ISON:
      const targetDevice = state.devices.find(
        (device) => device.deviceId === action.payload.deviceId
      );
      if (!targetDevice) {
        console.warn("device not found");
        return state;
      }
      targetDevice!.isOn = action.payload.isOn;
      const newDevices = state.devices.map((device) =>
        device.deviceId === action.payload.deviceId ? targetDevice : device
      );
      return {
        ...state,
        devices: newDevices,
      };

    case ActionType.SET_LIGHTMODE:
      const targetDevice1 = state.devices.find(
        (device) => device.deviceId === action.payload.deviceId
      );
      if (targetDevice1 instanceof MZDS01_LED) {
        targetDevice1!.lightMode = action.payload.lightMode;
        const newDevices1 = state.devices.map((device) =>
          device.deviceId === action.payload.deviceId ? targetDevice1 : device
        );
        return {
          ...state,
          devices: newDevices1,
        };
      }
      console.warn("lightMode is not supported on this device");
      return state;

    case ActionType.SET_BRIGHTNESS:
      const targetDevice2 = state.devices.find(
        (device) => device.deviceId === action.payload.deviceId
      );
      if (targetDevice2 instanceof MZDS01_LED) {
        targetDevice2!.brightness = action.payload.brightness;
        const newDevices2 = state.devices.map((device) =>
          device.deviceId === action.payload.deviceId ? targetDevice2 : device
        );
        return {
          ...state,
          devices: newDevices2,
        };
      }
      console.warn("brightness is not supported on this device");
      return state;

    case ActionType.SET_STROBING:
      const targetDevice4 = state.devices.find(
        (device) => device.deviceId === action.payload.deviceId
      );
      if (targetDevice4 instanceof MZDS01_LED) {
        targetDevice4!.strobing = action.payload.isStrobing;
        const newDevices4 = state.devices.map((device) =>
          device.deviceId === action.payload.deviceId ? targetDevice4 : device
        );
        return {
          ...state,
          devices: newDevices4,
        };
      }
      console.warn("strobing is not supported on this device");
      return state;

    case ActionType.SET_STROBE_FREQ:
      const targetDevice5 = state.devices.find(
        (device) => device.deviceId === action.payload.deviceId
      );
      if (targetDevice5 instanceof MZDS01_LED) {
        targetDevice5!.strobeFreq = action.payload.strobeFreq;
        const newDevices5 = state.devices.map((device) =>
          device.deviceId === action.payload.deviceId ? targetDevice5 : device
        );
        return {
          ...state,
          devices: newDevices5,
        };
      }
      console.warn("strobeFreq is not supported on this device");
      return state;

    case ActionType.ADD_TO_GROUP:
      const targetDevice3 = state.devices.find(
        (device) => device.deviceId === action.payload.deviceId
      );
      if (!targetDevice3) {
        console.warn("device not found");
        return state;
      }
      const newGroup = state.group;
      newGroup.addDevice(targetDevice3);
      return {
        ...state,
        group: newGroup,
      };

    case ActionType.REMOVE_FROM_GROUP:
      const targetDevice6 = state.devices.find(
        (device) => device.deviceId === action.payload.deviceId
      );
      if (!targetDevice6) {
        console.warn("device not found");
        return state;
      }
      const newGroup1 = state.group;
      newGroup1.removeDevice(targetDevice6);
      return {
        ...state,
        group: newGroup1,
      };

    case ActionType.SET_GROUP_ISON:
      const newGroup2 = state.group;
      newGroup2.isOn = action.payload.isOn;
      return {
        ...state,
        group: newGroup2,
      };

    default:
      return state;
  }
};

export const DevicesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DevicesContext.Provider value={{ state, dispatch }}>
      {children}
    </DevicesContext.Provider>
  );
};

export type Dispatch = React.Dispatch<Action>;

export const useDevicesContext = () => {
  const context = useContext(DevicesContext);

  if (!context) {
    throw new Error(
      "useDevicesContext must be used within a DevicesContextProvider"
    );
  }

  return context;
};
