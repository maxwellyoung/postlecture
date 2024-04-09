import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 600;

const ThoughtsListScreen = () => {
  const [thoughts, setThoughts] = useState([]);

  useEffect(() => {
    fetchThoughts();
  }, []);

  const fetchThoughts = async () => {
    const thoughtsCollection = collection(db, "thoughts");
    const snapshot = await getDocs(thoughtsCollection);
    const fetchedThoughts = await Promise.all(
      snapshot.docs.map(async (docSnapshot) => {
        const thoughtData = docSnapshot.data();

        let lectureName = "Unknown Lecture"; // Default value
        if (thoughtData.lectureTag) {
          // Check if lectureTag is present
          try {
            const lectureDocRef = doc(db, "lectures", thoughtData.lectureTag);
            const lectureDocSnapshot = await getDoc(lectureDocRef);
            if (lectureDocSnapshot.exists()) {
              lectureName = lectureDocSnapshot.data().name;
            }
          } catch (error) {
            console.error("Error fetching lecture name:", error);
            // Handle any errors (e.g., invalid lectureTag) here
          }
        }

        return {
          id: docSnapshot.id,
          lectureName,
          ...thoughtData,
        };
      }),
    );
    setThoughts(fetchedThoughts);
  };

  const removeThought = async (thoughtId) => {
    await deleteDoc(doc(db, "thoughts", thoughtId));
    fetchThoughts(); // Refresh the thoughts list after deletion
  };

  const RightActions = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.deleteBox}>
      <Ionicons name="trash-bin" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {thoughts.map((thought) => (
        <Swipeable
          key={thought.id}
          renderRightActions={() => (
            <RightActions onPress={() => removeThought(thought.id)} />
          )}
          containerStyle={styles.swipeableContainer}
        >
          <View style={styles.thoughtItem}>
            <Text style={styles.thoughtTitle}>
              {thought.lectureName || "No Lecture Title"}
            </Text>
            <Text style={styles.thoughtText}>Purpose: {thought.purpose}</Text>
            <Text style={styles.thoughtText}>
              Key Learning: {thought.keyLearning}
            </Text>
            <Text style={styles.thoughtText}>Questions: {thought.puzzles}</Text>
          </View>
        </Swipeable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: isLargeScreen ? 30 : 20,
    backgroundColor: "#f5f5f5",
  },
  swipeableContainer: {
    marginBottom: isLargeScreen ? 20 : 15,
    borderRadius: 10,
    overflow: "hidden", // Ensures the swipeable actions follow the rounded corners
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

export default ThoughtsListScreen;
