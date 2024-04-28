import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import ThoughtsScreen from "../screens/ThoughtsScreen";
import ThoughtsListScreen from "../screens/ThoughtsListScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="Thoughts" component={ThoughtsScreen} />
      <Stack.Screen name="Thoughts List" component={ThoughtsListScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
