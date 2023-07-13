import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { TARGET_ADDRESSES } from "../constants/uuids";
import LightCard from "../components/LightCard";
import { ActionTypes, useLightContext } from "../context/lightStore";
import { Avatar, Card, Switch, Text } from "react-native-paper";
import React from "react";

type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;

const Home = ({ navigation }: HomeProps) => {
  const {
    state: { lights, group },
    dispatch,
  } = useLightContext();

  const groupedLights = lights.filter((light) => light.grouped);

  const handleGroupPowerStateChange = () => {
    const newPowerState = !group.powerState;
    // groupedLights.forEach((light) => {
    //   dispatch({
    //     type: ActionTypes.SET_POWER_STATE,
    //     payload: {
    //       deviceId: light.deviceId,
    //     },
    //   });
    // });
    dispatch({
      type: ActionTypes.SET_POWER_STATE,
      payload: {
        deviceIds: groupedLights.map((light) => light.deviceId),
        powerState: newPowerState,
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar
        barStyle={"dark-content"} // isDarkMode ? 'light-content' : 'dark-content'
        // backgroundColor={backgroundStyle.backgroundColor}
      />
      {groupedLights.length > 0 && (
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
              value={group.powerState}
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
              {groupedLights.map((light, index) => (
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
                    <Text>{light.name}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {lights.map((light, index) => (
        <LightCard
          key={index.toString()}
          name={`Light ${index + 1}`}
          light={light}
          onPress={() =>
            !light.grouped &&
            navigation.navigate("LightControl", {
              deviceId: light.deviceId,
              screenTitle: `Light ${index + 1}`,
            })
          }
          dispatch={dispatch}
        />
      ))}
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
