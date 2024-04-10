import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 600;

const ThoughtsList = ({ thoughts, removeThought }) => {
  const RightActions = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.deleteBox}>
      <Ionicons name="trash-bin" size={24} color="white" />
    </TouchableOpacity>
  );

  // Adjusted styles for Swipeable container and thoughtItem for visual consistency
  return (
    <>
      {thoughts.map((thought) => (
        <Swipeable
          key={thought.id}
          renderRightActions={() => (
            <RightActions onPress={() => removeThought(thought.id)} />
          )}
          // Ensure the swipeable container extends fully without creating visual gaps
          containerStyle={[
            styles.swipeableContainer,
            { backgroundColor: "red" },
          ]}
          // Additional props like friction, overshootRight, etc., can adjust the feel
        >
          {/* Ensure this View has a consistent background color and fills the swipeable area */}
          <View style={[styles.thoughtItem, { backgroundColor: "white" }]}>
            <Text style={styles.thoughtTitle}>
              {thought.lectureName || "No Class Title"}
            </Text>
            <Text style={styles.thoughtText}>Purpose: {thought.purpose}</Text>
            <Text style={styles.thoughtText}>
              Key Learning: {thought.keyLearning}
            </Text>
            <Text style={styles.thoughtText}>Questions: {thought.puzzles}</Text>
          </View>
        </Swipeable>
      ))}
    </>
  );
};

// Assuming your styles object is elsewhere, ensure thoughtItem has a solid background
// and perhaps add adjustments to the swipeableContainer if necessary.

const styles = StyleSheet.create({
  swipeableContainer: {
    marginBottom: isLargeScreen ? 20 : 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  thoughtItem: {
    backgroundColor: "#fff",
    padding: isLargeScreen ? 20 : 15,
    borderRadius: 10,
  },
  thoughtTitle: {
    fontSize: isLargeScreen ? 20 : 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  thoughtText: {
    fontSize: isLargeScreen ? 18 : 14,
    marginBottom: 10,
  },
  deleteBox: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: "100%",
  },
});

export default ThoughtsList;
