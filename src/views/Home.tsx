import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import LightCard from "../components/LightCard";
import { Avatar, Card, Switch, Text } from "react-native-paper";
import React from "react";
import { ActionType, useDevicesContext } from "../context/devicesStore";

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;

const Home = ({ navigation }: HomeProps) => {
  const { state, dispatch } = useDevicesContext();
  const ledDevices = state.devices;
  const ledGroup = state.group;

  // const groupedLights = lights.filter((light) => light.grouped);

  const handleGroupPowerStateChange = () => {
    // const newPowerState = !group.powerState;
    // // groupedLights.forEach((light) => {
    // //   dispatch({
    // //     type: ActionTypes.SET_POWER_STATE,
    // //     payload: {
    // //       deviceId: light.deviceId,
    // //     },
    // //   });
    // // });
    // dispatch({
    //   type: ActionTypes.SET_POWER_STATE,
    //   payload: {
    //     deviceIds: groupedLights.map((light) => light.deviceId),
    //     powerState: newPowerState,
    //   },
    // });

    // const handleGroupPatternChange = () => {
    //   const newIsPattern = !ledGroup.isPattern;
    // };

    dispatch({
      type: ActionType.SET_GROUP_ISON,
      payload: {
        isOn: !ledGroup.isOn,
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar
        barStyle={"dark-content"} // isDarkMode ? 'light-content' : 'dark-content'
        // backgroundColor={backgroundStyle.backgroundColor}
      />
      {ledGroup.devices.length > 0 && (
        <Card
          onPress={() =>
            navigation.navigate("LightControl", {
              isGroupControl: true,
              screenTitle: "Grouped Lights",
            })
          }
        >
          {/*<Card.Title title={"Grouped Lights"} />*/}
          <View
            style={{
              marginTop: 8,
              marginLeft: 16,
              marginBottom: 20,
              flexDirection: "row",
            }}
          >
            <Text variant="titleLarge">Grouped Lights</Text>
            <View style={{ flex: 1 }} />
            <Switch
              value={ledGroup.isOn}
              onValueChange={handleGroupPowerStateChange}
              style={{ marginRight: 20, marginTop: 20 }}
            />
          </View>
          <Card.Content
            style={{
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {ledGroup.devices.map((light, index) => (
                <React.Fragment key={index}>
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Avatar.Icon
                      size={60}
                      icon="lightbulb"
                      style={{
                        marginHorizontal: 16,
                        marginBottom: 4,
                      }}
                    />
                    <Text>{light.deviceName}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
            <View>
              <Switch
                value={ledGroup.isPattern}
                onValueChange={handleGroupPatternChange}
                style={{ marginRight: 20, marginTop: 20 }}
              />
            </View>
          </Card.Content>
        </Card>
      )}

      {ledDevices.map((light) => {
        const isGrouped = false; // todo
        return (
          <LightCard
            key={light.deviceId}
            name={light.deviceName}
            light={light}
            onPress={() =>
              !isGrouped &&
              navigation.navigate("LightControl", {
                deviceId: light.deviceId,
                screenTitle: light.deviceName,
              })
            }
            dispatch={dispatch}
            isGrouped={isGrouped}
          />
        );
      })}

      {ledDevices.length === 0 && (
        <Text
          variant="titleLarge"
          style={{ textAlign: "center", marginTop: 64 }}
        >
          No lights found
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "white",
  },
});

export default Home;
