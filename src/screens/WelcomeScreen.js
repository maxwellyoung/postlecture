import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext"; // Adjust the path according to your file structure

const WelcomeScreen = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to PostLecture</Text>
      <Button title="Sign in with Google" onPress={signInWithGoogle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default WelcomeScreen;
