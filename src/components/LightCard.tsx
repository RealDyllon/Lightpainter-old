import { Card, Button, Switch } from "react-native-paper";
import { StyleSheet } from "react-native";
import React from "react";
import { ActionTypes, Light } from "../context/lightStore";
import { MD3LightTheme as DefaultTheme } from "react-native-paper";

interface LightCardProps {
  onPress: () => void;
  name: string;
  light: Light;
  dispatch: React.Dispatch<any>;
}

const LightCard = ({ onPress, name, light, dispatch }: LightCardProps) => {
  // return null;
  return (
    <Card onPress={onPress} style={styles.card}>
      <Card.Title title={name} />
      <Card.Actions>
        <Button
          icon={light.grouped ? "lightbulb-group" : "plus"}
          // iconColor={light.grouped ? "white" : DefaultTheme.colors.primary}
          mode={light.grouped ? "contained" : "outlined"}
          // containerColor={light.grouped ? DefaultTheme.colors.primary : "white"}
          size={28}
          onPress={() =>
            light.grouped
              ? dispatch({
                  type: ActionTypes.REMOVE_FROM_GROUP,
                  payload: {
                    deviceId: light.deviceId,
                  },
                })
              : dispatch({
                  type: ActionTypes.ADD_TO_GROUP,
                  payload: {
                    deviceId: light.deviceId,
                    // grouped: !light.grouped,
                  },
                })
          }
        >
          {light.grouped ? "Grouped" : "Add to Group"}
        </Button>
        <Switch
          value={light.powerState}
          disabled={light.grouped}
          onValueChange={() =>
            dispatch({
              type: ActionTypes.SET_POWER_STATE,
              payload: {
                deviceId: light.deviceId,
                powerState: !light.powerState,
              },
            })
          }
          // style={{ marginRight: 20, marginTop: 20 }}
        />
      </Card.Actions>
    </Card>
  );
};

export default LightCard;

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
  },
});
