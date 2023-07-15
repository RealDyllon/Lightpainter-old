import { Card, Button, Switch, Text } from "react-native-paper";
import { StyleSheet } from "react-native";
import React from "react";
import { ActionType, LEDDevice } from "../context/devicesStore";

interface LightCardProps {
  onPress: () => void;
  name: string;
  light: LEDDevice;
  dispatch: React.Dispatch<any>;
  isGrouped: boolean;
}

const LightCard = ({
  onPress,
  name,
  light,
  dispatch,
  isGrouped,
}: LightCardProps) => {
  // return null;
  return (
    <Card onPress={onPress} style={styles.card}>
      <Card.Title title={name} />
      <Card.Actions>
        <Button
          icon={isGrouped ? "lightbulb-group" : "plus"}
          // iconColor={light.grouped ? "white" : DefaultTheme.colors.primary}
          mode={isGrouped ? "contained" : "outlined"}
          // containerColor={light.grouped ? DefaultTheme.colors.primary : "white"}
          // @ts-ignore
          size={28}
          onPress={() =>
            isGrouped
              ? dispatch({
                  type: ActionType.REMOVE_FROM_GROUP,
                  payload: {
                    deviceId: light.deviceId,
                  },
                })
              : dispatch({
                  type: ActionType.ADD_TO_GROUP,
                  payload: {
                    deviceId: light.deviceId,
                    // grouped: !light.grouped,
                  },
                })
          }
        >
          <Text>{isGrouped ? "Grouped" : "Add to Group"}</Text>
        </Button>
        <Switch
          value={light.isOn}
          disabled={isGrouped}
          onValueChange={() => {
            console.log("light", light);
            console.log("light.isOn", light.isOn);
            dispatch({
              type: ActionType.SET_ISON,
              payload: {
                deviceId: light.deviceId,
                isOn: !light.isOn,
              },
            });
          }}
          style={{ marginRight: 20, marginTop: 20 }}
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
