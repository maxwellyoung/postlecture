import React from "react";
import { View, Text, StyleSheet } from "react-native";

const QuizScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz</Text>
      {/* Implement quiz functionality here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default QuizScreen;
