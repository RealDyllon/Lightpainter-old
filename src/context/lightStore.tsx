import React, { createContext, useContext, useReducer } from "react";
import { LightModes } from "../constants/codes";
import { TARGET_ADDRESSES } from "../constants/uuids";
import { writeSetPowerState } from "../utils/lightUtils";

type Props = {
  children: React.ReactNode;
};

export type Light = {
  deviceId: string;
  name: string;
  powerState: boolean;
  lightMode: LightModes;
  brightness: number;
  strobeFreq: number;
  grouped: boolean;
};

type State = {
  group: Pick<Light, "powerState" | "lightMode" | "brightness" | "strobeFreq">;
  lights: Array<Light>;
};

export enum ActionTypes {
  ADD_DEVICE = "ADD_DEVICE",
  REMOVE_DEVICE = "REMOVE_DEVICE",
  SET_POWER_STATE = "SET_POWER_STATE",
  SET_LIGHT_MODE = "SET_LIGHT_MODE",
  SET_BRIGHTNESS = "SET_BRIGHTNESS",
  SET_STROBE_FREQ = "SET_STROBE_FREQ",
  SET_COLOR = "SET_COLOR",
  ADD_TO_GROUP = "ADD_TO_GROUP",
  REMOVE_FROM_GROUP = "REMOVE_FROM_GROUP",
}

type Action = {
  type: ActionTypes;
  payload: any;
};

type Context = {
  state: State;
  dispatch: React.Dispatch<any>;
};

const initialState: State = {
  group: {
    powerState: true,
    lightMode: LightModes.WarmWhite,
    brightness: 20,
    strobeFreq: 0,
  },
  lights: TARGET_ADDRESSES.map((deviceId, index) => ({
    deviceId,
    name: `Light ${index + 1}`,
    powerState: true,
    lightMode: LightModes.Rainbow,
    brightness: 20,
    strobeFreq: 0,
    grouped: true,
  })),
};

// Just find-replace "LightContext" with whatever context name you like. (ie. DankContext)
const LightContext = createContext<Context>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_POWER_STATE.toString():
      writeSetPowerState(
        action.payload.deviceId
          ? [action.payload.deviceId]
          : action.payload.deviceIds,
        action.payload.powerState
        // state.lights.find(
        //   (light) => light.deviceId === action.payload.deviceId
        // )!?.lightMode
      ).then();
      if (action.payload.deviceId) {
        return setPowerState(state, action.payload);
      } else {
        return setPowerStateBulk(state, action.payload);
      }
    case ActionTypes.ADD_TO_GROUP.toString():
      return addToGroup(state, action.payload);
    case ActionTypes.REMOVE_FROM_GROUP.toString():
      return removeFromGroup(state, action.payload);
    // case 'ADD_TODO':
    //   return addTodo(state, action.todoText);
    // case 'REMOVE_TODO':
    //   return removeTodo(state, action.todoId);
    // case 'EDIT_TODO_TAG':
    //   return editTodoTag(state, action.todoId, action.tag);
    default:
      console.log("unknown action type", action.type);
      return state;
  }
};

const setPowerState = (state: State, payload: any) => {
  const { deviceId, powerState } = payload;
  const lights = state.lights.map((light) => {
    if (light.deviceId === deviceId) {
      return {
        ...light,
        powerState,
      };
    }
    return light;
  });
  return {
    ...state,
    lights,
  };
};

const setPowerStateBulk = (state: State, payload: any) => {
  const { deviceIds, powerState } = payload;
  const lights = state.lights.map((light) => {
    if (deviceIds.includes(light.deviceId)) {
      return {
        ...light,
        powerState,
      };
    }
    return light;
  });
  return {
    ...state,
    lights,
  };
};

const addToGroup = (state: State, payload: any) => {
  const { deviceId, groupId } = payload;
  const lights = state.lights.map((light) => {
    if (light.deviceId === deviceId) {
      return {
        ...light,
        grouped: true,
      };
    }
    return light;
  });
  return {
    ...state,
    lights,
  };
};

const removeFromGroup = (state: State, payload: any) => {
  const { deviceId, groupId } = payload;
  const lights = state.lights.map((light) => {
    if (light.deviceId === deviceId) {
      return {
        ...light,
        grouped: false,
      };
    }
    return light;
  });
  return {
    ...state,
    lights,
  };
};

export const LightContextProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <LightContext.Provider value={{ state, dispatch }}>
      {children}
    </LightContext.Provider>
  );
};

export const useLightContext = () => {
  const context = useContext(LightContext);

  if (!context) {
    throw new Error(
      "LightContext must be called from within the LightContextProvider"
    );
  }

  return context;
};
