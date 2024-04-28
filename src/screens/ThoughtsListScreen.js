import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import ThoughtsList from "../components/ThoughtsList.js"; // Adjust the import path as needed

const { width } = Dimensions.get("window");
const isLargeScreen = width > 600;

const ThoughtsListScreen = () => {
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThoughts();
  }, []);

  const fetchThoughts = async () => {
    setLoading(true); // Ensure loading is set to true when the fetch begins
    const thoughtsCollection = collection(db, "thoughts");
    const snapshot = await getDocs(thoughtsCollection);
    const fetchedThoughts = [];

    for (const docSnapshot of snapshot.docs) {
      const thoughtData = docSnapshot.data();

      // Initialize className as "Unassigned Class" to cover cases where classTag is missing or invalid.
      let lectureName = "Unassigned Class";

      if (thoughtData.lectureTag) {
        try {
          const lectureDocRef = doc(db, "lectures", thoughtData.lectureTag);
          const lectureDocSnapshot = await getDoc(lectureDocRef);

          if (lectureDocSnapshot.exists()) {
            lectureName = lectureDocSnapshot.data().name;
          } else {
            console.log(`Lecture not found for ID: ${thoughtData.lectureTag}`);
          }
        } catch (error) {
          console.error("Error fetching lecture name:", error);
          // Handle any errors (e.g., invalid lectureTag) here
        }
      }

      fetchedThoughts.push({
        id: docSnapshot.id,
        lectureName, // Ensures compatibility with the frontend terminology
        ...thoughtData,
      });
    }

    setThoughts(fetchedThoughts);
    setLoading(false); // Ensure loading is set to false after fetch completion
  };

  const removeThought = async (thoughtId) => {
    await deleteDoc(doc(db, "thoughts", thoughtId));
    fetchThoughts(); // Refresh the thoughts list after deletion
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThoughtsList thoughts={thoughts} removeThought={removeThought} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: isLargeScreen ? 30 : 20,
    backgroundColor: "#f5f5f5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ThoughtsListScreen;
