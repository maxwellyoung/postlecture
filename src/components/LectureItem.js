import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const LectureItem = ({ lecture, onRemove }) => {
  return (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity onPress={onRemove} style={styles.deleteBox}>
          <Ionicons name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
      )}
    >
      <View style={styles.item}>
        <Text style={styles.title}>{lecture.name}</Text>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
  },
  deleteBox: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: "100%",
    marginRight: 16,
    borderRadius: 5,
  },
});

export default LectureItem;
