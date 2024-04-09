import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import * as Font from "expo-font";
import { ActivityIndicator, View } from "react-native";

const fetchFonts = () => {
  return Font.loadAsync({
    "Pantasia-Regular": require("./assets/fonts/Pantasia-Regular.otf"),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    fetchFonts()
      .then(() => setFontsLoaded(true))
      .catch(console.warn);
  }, []);

  if (!fontsLoaded) {
    // Display a loading indicator or some placeholder content while fonts load
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
