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
import moment from "moment";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 600;

const ThoughtsList = ({ thoughts, removeThought }) => {
  const RightActions = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.deleteBox}>
      <Ionicons name="trash-bin" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <>
      {thoughts.map((thought) => (
        <Swipeable
          key={thought.id}
          renderRightActions={() => <RightActions onPress={() => removeThought(thought.id)} />}
          containerStyle={styles.swipeableContainer}
        >
          <View style={styles.thoughtItem}>
            <Text style={styles.thoughtTitle}>{thought.lectureName || "No Class Title"}</Text>
            <Text style={styles.thoughtDetail}>Purpose: {thought.purpose}</Text>
            <Text style={styles.thoughtDetail}>Key Learning: {thought.keyLearning}</Text>
            <Text style={styles.thoughtDetail}>Questions: {thought.puzzles}</Text>
            <Text style={styles.thoughtDetail}>
              Created on: {thought.createdAt ? moment(thought.createdAt).format("MMM Do, YYYY") : "Unknown"}
            </Text>
          </View>
        </Swipeable>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  swipeableContainer: {
    marginBottom: isLargeScreen ? 20 : 15,
    borderRadius: 10,
    backgroundColor: "#f0f0f0", // Even lighter background for contrast
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6, // Slightly more elevation for a subtle depth effect
  },
  thoughtItem: {
    backgroundColor: "#fff",
    paddingVertical: isLargeScreen ? 25 : 20,
    paddingHorizontal: isLargeScreen ? 20 : 15,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea", // subtle separation if stacking without gaps
  },
  thoughtTitle: {
    fontSize: isLargeScreen ? 22 : 18,
    fontWeight: "600", // slightly less bold than 'bold'
    marginBottom: 8,
    color: "#333", // keeping it dark for better readability
  },
  thoughtDetail: {
    fontSize: isLargeScreen ? 16 : 14,
    lineHeight: 24, // increased line-height for better readability
    marginBottom: 6,
    color: "#555", // slightly lighter than title for hierarchical contrast
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
